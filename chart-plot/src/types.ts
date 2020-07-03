import { MouseEvent } from "react";

export interface IEvent {
  type: string;
  timestamp: number;
  [field: string]: any;
}

export interface IResponsive {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
}
export interface IPreSetColors {
  [k: string]: {
    _backgroundColor: string;
    _primaryColor: string;
    _hoverColor: string;
  };
}

export interface IDataValue {
  [k: string]: {
    y: string | number;
    x: Date;
  }[];
}

export interface IEventState {
  console: string;
  queue: IEvent[];
  dataValues: IDataValue;
  limit: number;
  dataRangeSize: number;
  updateTimeRate: number;
  showLastFirst: boolean;
  dataStepSize:number;
  presetColors:IPreSetColors;
  [k: string]: any;
}
export interface IAction {
  type: string;
  payload?: any;
}

export interface IReducer {
  [key: string]: (state: IEventState, action: IAction) => IEventState;
}

export interface Dict {
  [key: string]: any;
}

export type TonClick = GlobalEventHandlers["onclick"];
export type TButton = (
  event: MouseEvent<HTMLButtonElement, MouseEvent>
) => void;
