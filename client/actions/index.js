import { INITIAL_LOCATION, 
         SHOW_PAST_STEP_COUNT, 
         SHOW_CURRENT_STEP_COUNT,
         TRACE_USER_PATH,
         DELETE_USER_PATH,
         SET_TERRITORY_INFO,
         SET_STEP_COUNT } from './types';


export const getInitialLocation = location => {
  return {
    type: INITIAL_LOCATION,
    payload: location
  }
}

export const getPastStepCount = count => {
  return {
    type: SHOW_PAST_STEP_COUNT,
    payload: count
  }
}

export const getCurrentStepCount = count => {
  return {
    type: SHOW_CURRENT_STEP_COUNT,
    payload: count
  }
}

export const traceUserPath = coords => {
  return {
    type: TRACE_USER_PATH,
    payload: coords
  }
}

export const deleteUserPath = () => {
  return {
    type: DELETE_USER_PATH
  }
}

export const setTerritoryInfo = info => {
  return {
    type: SET_TERRITORY_INFO,
    payload: info
  }
}

export const setStepCount = steps => {
  return {
    type: SET_STEP_COUNT,
    payload: steps
  }
}
