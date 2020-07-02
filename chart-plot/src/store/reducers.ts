import { combineReducers } from "redux"
import { IAction, IReducer, IEventState } from "../types"
import { Types } from "../consts"


const INITIAL_STATE = {
    events:[],
    console:'',
    queue:[],
    limit:100,

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
    [Types.CONSOLE, 'console']
]

export const Reducers:IReducer = makeReducers(Actions) // {Mapping (state, action)=> {return {...state, *chages}}}

Reducers[Types.ADD_EVENT] = (state:IEventState, action:IAction) => {
    return { ...state, events: [...action.payload] }
}
Reducers[Types.ADD_QUEUE] = (state:IEventState, action:IAction) => {
    return { ...state, queue: [...action.payload] }
}




function ListEvents(state = INITIAL_STATE, action:IAction) {

    try {
        return Reducers[action.type](state, action)

    } catch (e) {
        return { ...state }
    }

}


export default ListEvents