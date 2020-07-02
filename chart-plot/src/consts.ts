import { IEvent, IPreSetColors } from "./types";
import { ChartData, ChartDataSets } from "chart.js";

export const Types = {
  ADD_EVENT: "ADD_EVENT",

  CONSOLE: "CONSOLE",
  ADD_QUEUE: "ADD_QUEUE",
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
interface IDataSet {
  [k: string]: {
    y: string | number;
    x: Date;
  }[];
}
export const EventsToDataset = (
  events: IEvent[],
  datasetList: IDataSet = {}
) => {
  let started = false;
  let groups: string[] = [];
  let cols: string[] = [];
  let start = 0;
  let end = 0;

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
  return datasetList;
};

export const EventsToChartData = (
  events: IEvent[],
  preSetColors: IPreSetColors = {}
): ChartData => {
  let usedColors: string[] = [];
  let datasets: ChartDataSets[] = [];

  const datasetList = EventsToDataset(events);

  Object.keys(datasetList).map((_lb) => {
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

    datasets.push({
      label: _lb,
      fill: false,
      lineTension: 0.1,
      backgroundColor: _backgroundColor,
      borderColor: _primaryColor,

      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: _primaryColor,
      pointBackgroundColor: _primaryColor,
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: _hoverColor,
      pointHoverBorderColor: _hoverColor,
      pointHoverBorderWidth: 2,
      pointRadius: 3,
      pointHitRadius: 10,
      data: datasetList[_lb],
    });
  });

  return {
    datasets,
  };
};
