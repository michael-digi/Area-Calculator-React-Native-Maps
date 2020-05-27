import { SET_TERRITORY_INFO } from '../actions/types'

const INITIAL_STATE = {
  area: 0,
  perimeter: 0,
  center: {
    latitude: 0,
    longitude: 0
  }
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SET_TERRITORY_INFO:
      return action.payload
    default:
      return state
  }
}