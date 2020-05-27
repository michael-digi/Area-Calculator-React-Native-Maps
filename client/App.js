import React from 'react';
import MapContainer from './MapContainer';
import StepCounter from './StepCounter';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStore } from 'redux';
import reducers from './reducers'
import { Ionicons } from '@expo/vector-icons';
import * as TaskManager from 'expo-task-manager';

const store = createStore(reducers);
const Tab = createBottomTabNavigator();

const LOCATION_TASK_NAME = 'background-location-task';

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'MapContainer') {
                  iconName = focused
                    ? 'ios-map'
                    : 'ios-map';
                } 
                else if (route.name === 'StepCount') {
                  iconName = focused ? 'ios-walk' : 'ios-walk';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
              tabBarOptions={{
                activeTintColor: 'blue',
                inactiveTintColor: 'gray',
              }} >
            <Tab.Screen name="MapContainer" component={MapContainer} />
            <Tab.Screen name="StepCount" component={StepCounter} />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   console.log(store, " this is the store")
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     return;
//   }
//   if (data) {
//     const { latitude, longitude } = data.locations[0].coords
//     console.log([latitude, longitude], ' this is data')
//     store.dispatch({type:"TRACE_USER_PATH", payload:{latitude: latitude, longitude: longitude}})
//     // do something with the locations captured in the background
//   }
// });

export default App
