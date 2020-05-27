import React from 'react';
import Map from './Map';
import { TouchableOpacity, 
         StyleSheet, 
         Text, 
         View, 
         Platform } from 'react-native';
import Constants from 'expo-constants';
import { getLocationAsync } from './locationHelpers';
import { getLastUpdate,
         updateDateAndSteps,
         getSteps } from './stepHelpers';
import { connect } from 'react-redux';
import { getInitialLocation, setStepCount } from './actions';
import styles from './Map.component.style.js';
import moment from 'moment';

class MapContainer extends React.Component {
  state = {
    errorMessage: null,
    loaded: false,
    isPedometerAvailable: "checking",
  };

  //Check device for Android to see if Sketch will work. 
  async componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'This will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
     const initialLocation = await getLocationAsync();
     this.props.getInitialLocation(initialLocation)
     this.checkStepCount()
       if(this.props.initialLocation){
         this.setState({
           loaded: true
         })
        }
      }
  }

  checkStepCount = async () => {
    let lastUpdate = await getLastUpdate()
    if (moment().diff(lastUpdate, 'days') > 7) {
      let updatedSteps = await updateDateAndSteps(lastUpdate)
      let newUpdate = await getLastUpdate()
      let steps = await getSteps(newUpdate)
      this.props.setStepCount(steps)
    }
    else {
      let steps = await getSteps(lastUpdate)
      this.props.setStepCount(steps)
    }
  }
   
  //Display a temporary message while user location loads
  render() {
    return (
      <View style = {styles.container}>
        {this.state.loaded === false ? 
          <Text style = {styles.text}> Gathering map info... </Text> : 
          <Map /> }
      </View>
    );
  }
}

const dispatch = {
  getInitialLocation,
  setStepCount
}

const mapStateToProps = state => ({
  initialLocation: state.initialLocation
})

export default connect(mapStateToProps, dispatch)(MapContainer)