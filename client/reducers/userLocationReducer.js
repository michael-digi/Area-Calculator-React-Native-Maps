import { INITIAL_LOCATION } from '../actions/types'

const INITIAL_STATE = {
  initialLocation: null
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case INITIAL_LOCATION:
      return action.payload
    default:
      return state
  }
}