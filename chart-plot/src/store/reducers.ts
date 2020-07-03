import { IAction, IReducer, IEventState } from "../types"
import { Types } from "../consts"


const INITIAL_STATE = {
    limit:500,
    dataRangeSize:100,
    updateTimeRate:10000,
    dataStepSize:20,
    showLastFirst:true,
    dataValues:{},
    queue:[],
    presetColors:{},    
    console:'',
    maxTime:undefined,
    minTime:undefined,
    

}

function makeReducers(keys:typeof Actions = []) {
    interface IOut {
        [key:string]:(state:IEventState, action:IAction) =>IEventState
    }
    let out:IOut = {}

    keys.map(
        ([_type, _action])=>{
            out[_type] = (state:IEventState, action:IAction) => {
                let newSate:IEventState = {...state}
                newSate[_action] = action.payload
                return newSate
            }
            return null
        }
    )
    return out
}



const Actions:Array<string[]> = [
    [Types.CONSOLE, 'console'],
    [Types.DATA_RANGE_SIZE, 'dataRangeSize'],
    [Types.DATA_STEP_SIZE, 'dataStepSize'],
    [Types.LIMIT, 'limit'],
    [Types.UPDATE_TIME_RATE, 'updateTimeRate'],
    [Types.MIN_TIME, 'minTime'],
    [Types.MAX_TIME, 'maxTime']

]

export const Reducers:IReducer = makeReducers(Actions) // {Mapping (state, action)=> {return {...state, *chages}}}

Reducers[Types.ADD_EVENT] = (state:IEventState, action:IAction) => {
    return { ...state, events: [...action.payload] }
}
Reducers[Types.ADD_QUEUE] = (state:IEventState, action:IAction) => {
    return { ...state, queue: [...action.payload] }
}

Reducers[Types.UPDATE_PRESET_COLORS] = (state:IEventState, action:IAction) => {
    return { ...state, presetColors: {...state.presetColors, ...action.payload} }
}


Reducers[Types.ADD_DATAVALUE] = (state:IEventState, action:IAction) => {
    return { ...state, dataValues: {...state.dataValues, ...action.payload} }
}




function ListEvents(state = INITIAL_STATE, action:IAction) {

    try {
        return Reducers[action.type](state, action)

    } catch (e) {
        return { ...state }
    }

}


export default ListEvents