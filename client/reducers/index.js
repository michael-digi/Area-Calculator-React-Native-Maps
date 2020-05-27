import { combineReducers } from 'redux';
import initialLocationReducer from './userLocationReducer';
import prevStepCountReducer from './prevStepCounterReducer';
import curStepCountReducer from './curStepCounterReducer';
import userPathReducer from './userPathReducer';
import territoryInfoReducer from './territoryReducer';

export default combineReducers({
  initialLocation: initialLocationReducer,
  prevStepCount: prevStepCountReducer,
  curStepCount: curStepCountReducer,
  userPath: userPathReducer,
  territoryInfo: territoryInfoReducer
})