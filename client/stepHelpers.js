import axios from 'axios';
import moment from 'moment';
import { Pedometer } from "expo-sensors";

function getTomorrow() {
  let end = moment();
  end = end.add(1, 'days')
  end = moment(end)
  return end
}

function getYesterday() {
  let end = moment();
  end = end.subtract(1, 'days')
  end = moment(end)
  return end
}

export async function getLastUpdate() {
  let lastUpdate = await axios.get('http://172.20.10.2:5000/stepsLastUpdate')
  lastUpdate = moment(lastUpdate.data[0].steps_last_update)
  
  return (lastUpdate)
}

export async function updateDateAndSteps(lastUpdate) {
  let steps, updatedSteps, updatedDate;
  let today = moment().format('YYYY-MM-DD')
  let now = getToday()
  
  let pedometerSteps = await Pedometer.getStepCountAsync(lastUpdate.toDate(), now.toDate())
  await axios.put('http://172.20.10.2:5000/steps', {
    updatedSteps: pedometerSteps.steps,
    updatedDate: today
  })
}

export async function getSteps(lastUpdate) {
  let tomorrow = getTomorrow()
  let databaseSteps = await axios.get('http://172.20.10.2:5000/steps')
  databaseSteps = databaseSteps.data[0].steps - databaseSteps.data[0].steps_spent
  let pedometerSteps = await Pedometer.getStepCountAsync(lastUpdate.toDate(), tomorrow.toDate())

  return databaseSteps + pedometerSteps.steps
}
  
  export function getDaysDifference(start, end) {
    return end.diff(start, 'days')
  }

  export function getToday() {
    let today = moment();
    return today
  }

  export function getStartingDate(date) {
    let start = moment().format(date);
    start = moment(start)
    return start
  } 
