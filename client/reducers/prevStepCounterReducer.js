import { SHOW_PAST_STEP_COUNT } from '../actions/types'

const INITIAL_STATE = {
  prevStepCount: 0
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SHOW_PAST_STEP_COUNT:
      return {...state, prevStepCount: action.payload}
    default:
      return state
  }
}