import React from 'react';
import MapContainer from './MapContainer';
import { TouchableOpacity, 
         StyleSheet, 
         Text, 
         View, 
         Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
  state = {
    initialLocation: null,
    errorMessage: null,
  };

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true
    });
    let { latitude, longitude } = location.coords
    let initialLocation = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    this.setState({
      initialLocation
    })
  };

  render() {
    return (
      <View style={styles.container}>
       { this.state.initialLocation === null ?
          <Text> Currently finding your location... </Text> :
          <MapContainer initialLocation = {this.state.initialLocation} /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});





