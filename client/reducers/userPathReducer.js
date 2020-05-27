import { TRACE_USER_PATH, DELETE_USER_PATH } from '../actions/types'

export default (state = [], action) => {
  switch(action.type) {
    case TRACE_USER_PATH:
      return [...state, action.payload]
    case DELETE_USER_PATH:
      return state = []
    default:
      return state
  }
}