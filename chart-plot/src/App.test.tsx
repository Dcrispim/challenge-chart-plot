import React from "react";
import { createStore } from "redux";
import { Reducers } from "./store/reducers";
import { IAction, IEventState } from "./types";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import {
  EventsToDataValues,
  DataValuesToChartData,
  generalDatasetConfig,
  updateDataValue,
  Types,
} from "./consts";
import ChartPlot from "./components/ChartPlot";
import Footer from "./components/Footer";
import Console from "./components/Console";

const INITIAL_STATE: IEventState = {
  limit: 10,
  dataRangeSize: 10,
  updateTimeRate: 10,
  dataStepSize: 1,
  showLastFirst: true,
  liveMode: false,
  minTime: undefined,
  maxTime: undefined,
  dataValues: {},
  queue: [],
  presetColors: {},
  console: "",
};

function TestEvents(state = INITIAL_STATE, action: IAction) {
  try {
    return Reducers[action.type](state, action);
  } catch (e) {
    return { ...state };
  }
}

const store = createStore(TestEvents);

const setUp = () => {
  let { getByTestId } = render(
    <Provider store={store}>
      <Console />
      <ChartPlot />
      <Footer />
    </Provider>
  );
  return getByTestId;
};

describe("Testing Components", () => {
  it("Should add Console text to the Redux State console", () => {
    let getByTestId = setUp();
    let btn = getByTestId("generate-btn");
    let textArea = getByTestId("console-textarea");

    fireEvent.change(textArea, { target: { value: eventListText } });

    expect(store.getState().console).toEqual(eventListText.trim());
  });

  it("Should convert Event list text to DataValue object", async () => {
    let getByTestId = setUp();
    let textArea = getByTestId("console-textarea");
    let btn = getByTestId("generate-btn");

    fireEvent.change(textArea, { target: { value: eventListText } });
    await act(async () => {
      await fireEvent.click(btn);
    });

    let { dataValues } = store.getState();
    expect(dataValues).toEqual(dataValueList);
  });

  it("Should convert alternative Event list text to DataValue object", async () => {
    let getByTestId = setUp();
    let btn = getByTestId("generate-btn");
    let textArea = getByTestId("console-textarea");
    let { dataValues } = store.getState();
    fireEvent.change(textArea, { target: { value: eventListArrayFormat } });

    await act(async () => {
      await fireEvent.click(btn);
    });

    expect(dataValues).toEqual(dataValueList);
  });
});

describe("Testing Functions", () => {
  it("[EventsToDataValues]=>Should convert event list to DataValue object", () => {
    let _dataset = EventsToDataValues(eventListResponse);

    expect(_dataset.datasetList).toEqual(dataValueList);
  });

  it("[DataValuesToChartData]=>Should convert event list to a ChartData object and presetColor Object", () => {
    let [datasets, _presetColors] = DataValuesToChartData(
      dataValueList,
      preSetColors
    );
    let ChartDataObject = {
      datasets,
    };
    expect(ChartDataObject).toEqual(chartDataObjectResponse);
    expect(_presetColors).toEqual(preSetColors);
  });
});

const eventListText = `
  { type: "start", timestamp: 1519862400000, select: ["min_response_time", "max_response_time"], group: ["os", "browser"] }
  { type: "span", timestamp: 1519862400000, begin: 1519862400000, end: 1519862600000 }
  { type: "data", timestamp: 1519862400000, os: "linux", browser: "chrome", min_response_time: 0.1, max_response_time: 1.3 }
  { type: "data", timestamp: 1519862400000, os: "mac", browser: "chrome", min_response_time: 0.2, max_response_time: 1.2 }
  { type: "data", timestamp: 1519862400000, os: "mac", browser: "firefox", min_response_time: 0.3, max_response_time: 1.2 }
  { type: "data", timestamp: 1519862400000, os: "linux", browser: "firefox", min_response_time: 0.1, max_response_time: 1.0 }
  { type: "data", timestamp: 1519862460000, os: "linux", browser: "chrome", min_response_time: 0.2, max_response_time: 0.9 }
  { type: "data", timestamp: 1519862460000, os: "mac", browser: "chrome", min_response_time: 0.1, max_response_time: 1.0 }
  { type: "data", timestamp: 1519862460000, os: "mac", browser: "firefox", min_response_time: 0.2, max_response_time: 1.1 }
  { type: "data", timestamp: 1519862460000, os: "linux", browser: "firefox", min_response_time: 0.3, max_response_time: 1.4 }
  { type: "stop", timestamp: 1619862460000 } 
`;
const eventListArrayFormat = `[
  {
    type: "start",
    timestamp: 1519862400000,
    select: ["min_response_time", "max_response_time"],
    group: ["os", "browser"],
  },
  {
    type: "span",
    timestamp: 1519862400000,
    begin: 1519862400000,
    end: 1519862600000,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "linux",
    browser: "chrome",
    min_response_time: 0.1,
    max_response_time: 1.3,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "mac",
    browser: "chrome",
    min_response_time: 0.2,
    max_response_time: 1.2,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "mac",
    browser: "firefox",
    min_response_time: 0.3,
    max_response_time: 1.2,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "linux",
    browser: "firefox",
    min_response_time: 0.1,
    max_response_time: 1.0,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "linux",
    browser: "chrome",
    min_response_time: 0.2,
    max_response_time: 0.9,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "mac",
    browser: "chrome",
    min_response_time: 0.1,
    max_response_time: 1.0,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "mac",
    browser: "firefox",
    min_response_time: 0.2,
    max_response_time: 1.1,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "linux",
    browser: "firefox",
    min_response_time: 0.3,
    max_response_time: 1.4,
  },
  { type: "stop", timestamp: 1619862460000 },
]`;

const eventListResponse = [
  {
    type: "start",
    timestamp: 1519862400000,
    select: ["min_response_time", "max_response_time"],
    group: ["os", "browser"],
  },
  {
    type: "span",
    timestamp: 1519862400000,
    begin: 1519862400000,
    end: 1519862600000,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "linux",
    browser: "chrome",
    min_response_time: 0.1,
    max_response_time: 1.3,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "mac",
    browser: "chrome",
    min_response_time: 0.2,
    max_response_time: 1.2,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "mac",
    browser: "firefox",
    min_response_time: 0.3,
    max_response_time: 1.2,
  },
  {
    type: "data",
    timestamp: 1519862400000,
    os: "linux",
    browser: "firefox",
    min_response_time: 0.1,
    max_response_time: 1,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "linux",
    browser: "chrome",
    min_response_time: 0.2,
    max_response_time: 0.9,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "mac",
    browser: "chrome",
    min_response_time: 0.1,
    max_response_time: 1,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "mac",
    browser: "firefox",
    min_response_time: 0.2,
    max_response_time: 1.1,
  },
  {
    type: "data",
    timestamp: 1519862460000,
    os: "linux",
    browser: "firefox",
    min_response_time: 0.3,
    max_response_time: 1.4,
  },
  { type: "stop", timestamp: 1619862460000 },
];
const dataValueList = {
  "linux chrome min time": [
    { y: 0.1, x: new Date(1519862400000) },
    { y: 0.2, x: new Date(1519862460000) },
  ],
  "linux chrome max time": [
    { y: 1.3, x: new Date(1519862400000) },
    { y: 0.9, x: new Date(1519862460000) },
  ],
  "mac chrome min time": [
    { y: 0.2, x: new Date(1519862400000) },
    { y: 0.1, x: new Date(1519862460000) },
  ],
  "mac chrome max time": [
    { y: 1.2, x: new Date(1519862400000) },
    { y: 1, x: new Date(1519862460000) },
  ],
  "mac firefox min time": [
    { y: 0.3, x: new Date(1519862400000) },
    { y: 0.2, x: new Date(1519862460000) },
  ],
  "mac firefox max time": [
    { y: 1.2, x: new Date(1519862400000) },
    { y: 1.1, x: new Date(1519862460000) },
  ],
  "linux firefox min time": [
    { y: 0.1, x: new Date(1519862400000) },
    { y: 0.3, x: new Date(1519862460000) },
  ],
  "linux firefox max time": [
    { y: 1, x: new Date(1519862400000) },
    { y: 1.4, x: new Date(1519862460000) },
  ],
};
const chartDataObjectResponse = {
  datasets: [
    {
      label: "linux chrome min time",
      backgroundColor: "rgba(50,180,116,1)",
      borderColor: "rgba(102,35,242,1)",
      pointBorderColor: "rgba(102,35,242,1)",
      pointBackgroundColor: "rgba(102,35,242,1)",
      pointHoverBackgroundColor: "rgba(102,35,242,0.5)",
      pointHoverBorderColor: "rgba(102,35,242,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["linux chrome min time"],
    },
    {
      label: "linux chrome max time",
      backgroundColor: "rgba(55,41,224,1)",
      borderColor: "rgba(178,38,160,1)",
      pointBorderColor: "rgba(178,38,160,1)",
      pointBackgroundColor: "rgba(178,38,160,1)",
      pointHoverBackgroundColor: "rgba(178,38,160,0.5)",
      pointHoverBorderColor: "rgba(178,38,160,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["linux chrome max time"],
    },
    {
      label: "mac chrome min time",
      backgroundColor: "rgba(186,15,221,1)",
      borderColor: "rgba(230,41,181,1)",
      pointBorderColor: "rgba(230,41,181,1)",
      pointBackgroundColor: "rgba(230,41,181,1)",
      pointHoverBackgroundColor: "rgba(230,41,181,0.5)",
      pointHoverBorderColor: "rgba(230,41,181,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["mac chrome min time"],
    },
    {
      label: "mac chrome max time",
      backgroundColor: "rgba(251,144,147,1)",
      borderColor: "rgba(70,168,166,1)",
      pointBorderColor: "rgba(70,168,166,1)",
      pointBackgroundColor: "rgba(70,168,166,1)",
      pointHoverBackgroundColor: "rgba(70,168,166,0.5)",
      pointHoverBorderColor: "rgba(70,168,166,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["mac chrome max time"],
    },
    {
      label: "mac firefox min time",
      backgroundColor: "rgba(54,96,28,1)",
      borderColor: "rgba(42,167,165,1)",
      pointBorderColor: "rgba(42,167,165,1)",
      pointBackgroundColor: "rgba(42,167,165,1)",
      pointHoverBackgroundColor: "rgba(42,167,165,0.5)",
      pointHoverBorderColor: "rgba(42,167,165,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["mac firefox min time"],
    },
    {
      label: "mac firefox max time",
      backgroundColor: "rgba(58,30,42,1)",
      borderColor: "rgba(1,134,74,1)",
      pointBorderColor: "rgba(1,134,74,1)",
      pointBackgroundColor: "rgba(1,134,74,1)",
      pointHoverBackgroundColor: "rgba(1,134,74,0.5)",
      pointHoverBorderColor: "rgba(1,134,74,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["mac firefox max time"],
    },
    {
      label: "linux firefox min time",
      backgroundColor: "rgba(214,172,125,1)",
      borderColor: "rgba(77,211,191,1)",
      pointBorderColor: "rgba(77,211,191,1)",
      pointBackgroundColor: "rgba(77,211,191,1)",
      pointHoverBackgroundColor: "rgba(77,211,191,0.5)",
      pointHoverBorderColor: "rgba(77,211,191,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["linux firefox min time"],
    },
    {
      label: "linux firefox max time",
      backgroundColor: "rgba(29,239,1,1)",
      borderColor: "rgba(253,182,100,1)",
      pointBorderColor: "rgba(253,182,100,1)",
      pointBackgroundColor: "rgba(253,182,100,1)",
      pointHoverBackgroundColor: "rgba(253,182,100,0.5)",
      pointHoverBorderColor: "rgba(253,182,100,0.5)",
      ...generalDatasetConfig,
      data: dataValueList["linux firefox max time"],
    },
  ],
};
const preSetColors = {
  "linux chrome min time": {
    _backgroundColor: "rgba(50,180,116,1)",
    _primaryColor: "rgba(102,35,242,1)",
    _hoverColor: "rgba(102,35,242,0.5)",
  },
  "linux chrome max time": {
    _backgroundColor: "rgba(55,41,224,1)",
    _primaryColor: "rgba(178,38,160,1)",
    _hoverColor: "rgba(178,38,160,0.5)",
  },
  "mac chrome min time": {
    _backgroundColor: "rgba(186,15,221,1)",
    _primaryColor: "rgba(230,41,181,1)",
    _hoverColor: "rgba(230,41,181,0.5)",
  },
  "mac chrome max time": {
    _backgroundColor: "rgba(251,144,147,1)",
    _primaryColor: "rgba(70,168,166,1)",
    _hoverColor: "rgba(70,168,166,0.5)",
  },
  "mac firefox min time": {
    _backgroundColor: "rgba(54,96,28,1)",
    _primaryColor: "rgba(42,167,165,1)",
    _hoverColor: "rgba(42,167,165,0.5)",
  },
  "mac firefox max time": {
    _backgroundColor: "rgba(58,30,42,1)",
    _primaryColor: "rgba(1,134,74,1)",
    _hoverColor: "rgba(1,134,74,0.5)",
  },
  "linux firefox min time": {
    _backgroundColor: "rgba(214,172,125,1)",
    _primaryColor: "rgba(77,211,191,1)",
    _hoverColor: "rgba(77,211,191,0.5)",
  },
  "linux firefox max time": {
    _backgroundColor: "rgba(29,239,1,1)",
    _primaryColor: "rgba(253,182,100,1)",
    _hoverColor: "rgba(253,182,100,0.5)",
  },
};
