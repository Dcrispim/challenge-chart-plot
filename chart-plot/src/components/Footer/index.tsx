import React, { useState, useEffect } from "react";
import style, { Buttom } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { Types, StringToObj } from "../../consts";
import { IEventState, IEvent } from "../../types";

const Footer: React.FC = (props) => {
  const dispatch = useDispatch();
  const limit = useSelector<IEventState, number>(({ limit }) => limit);
  const [loading, setLoading] = useState(false);

  const consoleText = useSelector<IEventState, string>(
    ({ console }) => console
  );
  const handleClick = async (evt: any) => {
    setLoading(true);
    let payload: IEvent[] =
      consoleText[0] === "["
        ? await StringToObj(consoleText)
        : await StringToObj("[" + consoleText.replace(/\n/g, `,\n`) + "]");

    if (payload.length > limit+3) {
      dispatch({
        type: Types.ADD_QUEUE,
        payload,
      });
      
      let _startEvent = payload.find((evt)=>evt.type==='start')||payload[0]
      let _spanEvent = payload.find((evt)=>evt.type==='span')||payload[1]
      let slicePayload:IEvent[] = [_startEvent, _spanEvent, ...payload.slice(payload.length-limit,payload.length-1)]
      dispatch({
        type: Types.ADD_EVENT,
        payload:slicePayload,
      });
      

    } else {
      dispatch({
        type: Types.ADD_EVENT,
        payload,
      });
    }
    setLoading(false);
  };
  useEffect(() => {}, [loading]);
  return (
    <div style={style}>
      <button data-testid="generate-btn" onClick={handleClick} style={Buttom}>
        GENERATE CHART
      </button>

    </div>
  );
};

const H2: React.FC<{ loading: boolean }> = ({ loading }) => {
  return <h2>{`${loading}`}</h2>;
};

export default Footer;
