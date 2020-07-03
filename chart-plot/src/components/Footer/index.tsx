import React, { useEffect, useState } from "react";
import style, { Buttom, Input, Advanced } from "./style";
import { useDispatch, useSelector } from "react-redux";
import {
  Types,
  StringToObj,
  EventsToDataValues,
  updateDataValue,
} from "../../consts";
import { IEventState, IEvent, IDataValue } from "../../types";

const Footer: React.FC = (props) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const dataRangeSize = useSelector<IEventState, number>(
    ({ dataRangeSize }) => dataRangeSize
  );
  const dataStepSize = useSelector<IEventState, number>(
    ({ dataStepSize }) => dataStepSize
  );
  const limit = useSelector<IEventState, number>(({ limit }) => limit);
  const updateTimeRate = useSelector<IEventState, number>(
    ({ updateTimeRate }) => updateTimeRate
  );
  const queue = useSelector<IEventState, IEvent[]>(({ queue }) => queue);
  const dataValues = useSelector<IEventState, IDataValue>(
    ({ dataValues }) => dataValues
  );
  const showLastFirst = useSelector<IEventState, boolean>(
    ({ showLastFirst }) => showLastFirst
  );
  const consoleText = useSelector<IEventState, string>(
    ({ console }) => console
  );

  const handleClick = async (evt: any) => {
    let datasets: IDataValue = {};

    let eventList: IEvent[] =
      consoleText[0] === "["
        ? await StringToObj(consoleText)
        : await StringToObj("[" + consoleText.replace(/\n/g, `,\n`) + "]");

    if (eventList.length > dataRangeSize + 3) {
      let _startEvent =
        eventList.find((evt) => evt.type === "start") || eventList[0];
      let _spanEvent =
        eventList.find((evt) => evt.type === "span") || eventList[1];

      if (!showLastFirst) {
        eventList = [...eventList.sort((a, b) => b.timestamp - a.timestamp)];
      }

      let sliceEventList: IEvent[] = [
        _startEvent,
        _spanEvent,
        ...eventList.slice(
          eventList.length - dataRangeSize - 1,
          eventList.length
        ),
      ];

      let { datasetList, minTime, maxTime } = EventsToDataValues(
        sliceEventList
      );

      datasets = { ...datasetList };

      dispatch({ type: Types.MIN_TIME, payload: minTime });
      dispatch({ type: Types.MAX_TIME, payload: maxTime });

      dispatch({
        type: Types.ADD_QUEUE,
        payload: [
          _startEvent,
          _spanEvent,
          ...eventList.slice(0, eventList.length - dataRangeSize),
        ],
      });
    } else {
      datasets = { ...EventsToDataValues(eventList).datasetList };
    }

    dispatch({
      type: Types.ADD_DATAVALUE,
      payload: datasets,
    });
  };

  const handleChange = (type: string, payload: any) => {
    if (Number(payload)) {
      dispatch({ type, payload: Number(payload) });
    }
  };

  useEffect(() => {
    if (dataRangeSize <= limit && queue.length > 0) {
      setTimeout(() => {
        dispatch({
          type: Types.DATA_RANGE_SIZE,
          payload:
            dataRangeSize + dataStepSize < limit
              ? dataRangeSize + dataStepSize
              : limit,
        });
        if (dataRangeSize < limit) {
          const [newDataValue, newQueue] = updateDataValue(
            queue,
            dataValues,
            dataRangeSize,
            limit,
            dataStepSize
          );

          dispatch({
            type: Types.ADD_DATAVALUE,
            payload: newDataValue,
          });

          dispatch({
            type: Types.ADD_QUEUE,
            payload: newQueue,
          });
        }
      }, updateTimeRate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue]);

  return (
    <div style={style}>
      <button data-testid="generate-btn" onClick={handleClick} style={Buttom}>
        GENERATE CHART
      </button>
      <label style={{display:show?'flex':'none', alignSelf:'center'}}>Range Data Size</label>
      <input
        style={{ ...Input, display: show ? "flex" : "none" }}
        placeholder="Range Data Size"
        defaultValue={dataRangeSize}
        onChange={(e) => handleChange(Types.DATA_RANGE_SIZE, e.target.value)}
        type="number"
      />
      <label style={{display:show?'flex':'none', alignSelf:'center'}}>Time Update</label>
      <input
        style={{ ...Input, display: show ? "flex" : "none" }}
        placeholder="Time Update"
        defaultValue={updateTimeRate}
        onChange={(e) => handleChange(Types.UPDATE_TIME_RATE, e.target.value)}
        type="number"
      />
      <label style={{display:show?'flex':'none', alignSelf:'center'}}>Step Data Size</label>
      <input
        style={{ ...Input, display: show ? "flex" : "none" }}
        placeholder="Step Data Size"
        defaultValue={dataStepSize}
        onChange={(e) => handleChange(Types.DATA_STEP_SIZE, e.target.value)}
        type="number"
      />
      <label style={{display:show?'flex':'none', alignSelf:'center'}}>Limit</label>
      <input
        style={{ ...Input, display: show ? "flex" : "none" }}
        placeholder="Limit"
        defaultValue={limit}
        onChange={(e) => handleChange(Types.LIMIT, e.target.value)}
        type="number"
      />
      <button onClick={() => setShow(!show)} style={Advanced}>
        Advanced Config
      </button>
    </div>
  );
};

export default Footer;
