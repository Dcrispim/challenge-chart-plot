import { IEvent, IPreSetColors, IDataValue } from "./types";
import { ChartData, ChartDataSets, ChartOptions } from "chart.js";

export const Types = {
  ADD_EVENT: "ADD_EVENT",
  ADD_QUEUE: "ADD_QUEUE",
  ADD_DATAVALUE: "ADD_DATAVALUE",
  CONSOLE: "CONSOLE",
  LIMIT: "LIMIT",
  DATA_STEP_SIZE: "DATA_STEP_SIZE",
  DATA_RANGE_SIZE: "DATA_RANGE_SIZE",
  UPDATE_TIME_RATE: "UPDATE_TIME_RATE",
  UPDATE_PRESET_COLORS: "UPDATE_PRESET_COLORS",
  MIN_TIME: "MIN_TIME",
  MAX_TIME: "MAX_TIME",
};

const getRandomInt = () => {
  return Math.floor(Math.random() * 255);
};

const getRandomColor = (usedColors: string[]) => {
  let newColor = `rgba(${getRandomInt()},${getRandomInt()},${getRandomInt()},1)`;
  while (usedColors.includes(newColor)) {
    newColor = `rgba(${getRandomInt()},${getRandomInt()},${getRandomInt()},1)`;
  }
  return newColor;
};

export const StringToObj = async (text: string) => {
  let outObject: IEvent[] = [];
  let parsedText = text
    .replace(/'/g, '"')
    .slice(1, text.length - 1)
    .split(",")
    .reduce((p, c) => {
      //c = `{ exemple: "test"`
      if (!c.includes(":")) {
        return `${p}${c.trim() === "}" || c.trim() === "]" ? "" : ","}${c}`;
      }

      let [Key, value] = c.split(":"); //[`{ exemple]`,[` "test"`]
      let _splitKey = Key.trim().split(" "); // [`{`, `exemple`]
      Key =
        _splitKey.slice(0, _splitKey.length - 1).join(" ") +
        '"' +
        _splitKey[_splitKey.length - 1] +
        '"'; //`{ "exemple"`

      return `${p}${
        p && c.trim().length > 0 ? ", " : ""
      }${Key.trim()}:${value}`;
    }, "")
    .trim();

  if (parsedText[parsedText.length - 1] === ",") {
    parsedText = parsedText.slice(0, parsedText.length - 1);
  }

  try {
    try {
      outObject = [...JSON.parse("[{" + parsedText + "}]")];
    } catch (error) {
      outObject = [...JSON.parse("[" + parsedText + "]")];
    }
  } catch (error) {
    console.log(error);
  } finally {
    return outObject.sort((a, b) => a.timestamp - b.timestamp);
  }
};

const createLabels = (
  labelNames: string[],
  cols: string[],
  event: IEvent,
  colsAlias: string[] = []
) => {
  let _out = cols.map((col) => {
    let lb: string =
      labelNames.reduce((p, c) => {
        return `${p} ${event[c] || ""}`.trim();
      }, "") + ` ${colsAlias[cols.indexOf(col)] || col}`;
    let value = event[col];
    return [lb, value];
  });

  return _out;
};

export const EventsToDataValues = (
  events: IEvent[],
  datasetList: IDataValue = {}
) => {
  let started = false;
  let groups: string[] = [];
  let cols: string[] = [];
  let start = 0;
  let end = 0;
  let minTime = new Date();
  let maxTime = new Date();

  for (let i = 0; i < events.length; i++) {
    let event = events.sort((a, b) => a.timestamp - b.timestamp)[i];

    if (event.type === "start") {
      started = true;
      groups = [...event.group];
      cols = [...event.select];
    }

    if (event.type === "span") {
      start = event.begin || 0;
      end = event.end || 0;
    }

    if (event.type === "stop") {
      started = false;
      break;
    }

    if (
      started &&
      event.type === "data" &&
      event.timestamp >= start &&
      event.timestamp <= end
    ) {
      if (event.timestamp < minTime.getTime()) {
        minTime = new Date(event.timestamp);
      }

      if (event.timestamp > maxTime.getTime()) {
        maxTime = new Date(event.timestamp);
      }

      createLabels(groups, cols, event, ["min time", "max time"]).map(
        ([key, value]) => {
          if (datasetList[key] !== undefined) {
            datasetList[key].push({ y: value, x: new Date(event.timestamp) });
          } else {
            datasetList[key] = [];
            datasetList[key].push({ y: value, x: new Date(event.timestamp) });
          }

          return null;
        }
      );
    }
  }
  return { datasetList, minTime, maxTime };
};

export const DataValuesToChartData = (
  dataValueList: IDataValue,
  preSetColors: IPreSetColors = {}
): [ChartDataSets[], IPreSetColors] => {
  let usedColors: string[] = [];
  let datasets: ChartDataSets[] = [];

  Object.keys(dataValueList).map((_lb) => {
    let _backgroundColor = preSetColors[_lb]
      ? preSetColors[_lb]._backgroundColor
      : getRandomColor(usedColors);
    usedColors.push(_backgroundColor);

    let _primaryColor = preSetColors[_lb]
      ? preSetColors[_lb]._primaryColor
      : getRandomColor(usedColors);
    usedColors.push(_primaryColor);

    let _hoverColor = preSetColors[_lb]
      ? preSetColors[_lb]._hoverColor
      : _primaryColor.slice(0, _primaryColor.length - 2) + "0.5)";
    usedColors.push(_hoverColor);
    preSetColors[_lb] = {
      ...preSetColors[_lb],
      _backgroundColor,
      _primaryColor,
      _hoverColor,
    };
    datasets.push({
      label: _lb,
      backgroundColor: _backgroundColor,
      borderColor: _primaryColor,
      pointBorderColor: _primaryColor,
      pointBackgroundColor: _primaryColor,
      pointHoverBackgroundColor: _hoverColor,
      pointHoverBorderColor: _hoverColor,
      data: dataValueList[_lb],
      ...generalDatasetConfig,
    });
  });

  return [datasets, preSetColors];
};

export const updateDataValue = (
  _queue: IEvent[],
  dataValues: IDataValue,
  dataRangeSize: number,
  limit: number,
  dataStepSize: number,
  _minTime: Date | undefined = undefined,
  _maxTime: Date | undefined = undefined
): [IDataValue, IEvent[], Date | undefined, Date | undefined] => {
  if (dataRangeSize >= limit) {
    return [dataValues, _queue, _minTime, _maxTime];
  }

  let _startEvent = _queue.find((evt) => evt.type === "start");
  let _spanEvent = _queue.find((evt) => evt.type === "span");

  if (_startEvent && _spanEvent) {
    let _initQueueIndex =
      _queue.length - dataStepSize >= 0 ? _queue.length - dataStepSize : 0;
    let _currentEvents = [
      _startEvent,
      _spanEvent,
      ..._queue.slice(_initQueueIndex, _queue.length),
    ];
    let _newQueue = _queue.slice(0, _initQueueIndex + 1 || 0);
    let _outDataValues = { ...dataValues };
    let {
      datasetList,
      minTime = _minTime,
      maxTime = _maxTime,
    } = EventsToDataValues(_currentEvents);
    Object.keys(datasetList).map((label) => {
      if (dataValues[label]) {
        datasetList[label].map((point) => {
          if (!dataValues[label].includes(point)) {
            _outDataValues[label].push(point);
          }
          _outDataValues[label] = [
            ..._outDataValues[label].sort(
              (a, b) => a.x.getTime() - b.x.getTime()
            ),
          ];
        });
      }
    });

    return [_outDataValues, _newQueue, minTime, _maxTime];
  } else {
    return [dataValues, _queue, _minTime, _maxTime];
  }
};

export const generalDatasetConfig: ChartDataSets = {
  fill: false,
  lineTension: 0.1,
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 3,
  pointHitRadius: 10,
};

export const ChartPlotOptions: ChartOptions = {
  legend: {
    position: "right",
    labels: { usePointStyle: true },
  },

  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        stacked: false,
        type: "time",
        distribution: "series",
        time: {
          unit: "minute",
          unitStepSize:1,
        },
      },
    ],
  },
};
