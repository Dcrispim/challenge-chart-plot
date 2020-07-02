import React, { useState } from "react";
import style from "./style";
import { useDispatch } from "react-redux";
import { Types } from "../../consts";

const Console: React.FC = (props) => {
  const dispatch = useDispatch()
  const handleChange = (evt: any) => {

    let text: string = evt.target.value;
    try {
      dispatch({type:Types.CONSOLE, payload:text.trim()})
    } catch (error) {
    }
  };
  
  return <textarea data-testid='console-textarea' id='console' onChange={handleChange} style={style}></textarea>;
};

export default Console;
