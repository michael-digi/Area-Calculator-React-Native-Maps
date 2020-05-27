import { SHOW_CURRENT_STEP_COUNT, SET_STEP_COUNT } from '../actions/types'

const INITIAL_STATE = {
  curStepCount: 0,
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SHOW_CURRENT_STEP_COUNT:
      return state.curStepCount
    case SET_STEP_COUNT:
      return {...state, curStepCount: action.payload}
    default:
      return state
  }
}