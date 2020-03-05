import React from 'react';
import MapView from 'react-native-maps';
import { Alert } from 'react-native';
import { TouchableOpacity, 
         StyleSheet, 
         Text, 
         View, 
         Platform 
       } from 'react-native';
import { calculateArea, findCenter } from './helpers';

export default class Map extends React.Component {
  
  state = {
    points: [],
    poly: [],
    polygon: false,
    showMarks: true,
    region: this.props.initialLocation,
    area: ''
  }

  //Activated by the onPress/onPoiClick prop. It adds coordinates to the 
  //points and poly states
  addPoints = (e) => {
    this.setState({
      showMarks: true,
      points: [...this.state.points, {latlng: e.nativeEvent.coordinate}],
      poly: [...this.state.poly, e.nativeEvent.coordinate]
    })
  }
  //Set all items displayed on the map to empty/false
  clear = () => {
    this.setState({
      points: [],
      polygon: false,
      poly: [],
      showMarks: !this.state.showMarks
    })
  }
  //Toggle between Polylines and their equivalent Polygon
  togglePolygon = () => {
    this.setState({
      polygon: !this.state.polygon,
    })
  }

  changeCoordinate = (e, index) => {
    let newCoord = e.nativeEvent.coordinate;
    let newEditing = Object.assign({},this.state.poly);
    let newCoordinates = Object.assign({},newEditing);
    newCoordinates[index] = newCoord;
    newEditing = newCoordinates;
    let transformedCoords = Object.keys(newEditing).map(function (key)
      { return newEditing[key]; });
    newEditing = transformedCoords;
    this.setState({
      poly: newEditing
    })
  }
  //Uses the calculateArea function imported in from helpers.js to compute the area
  //of the created Polygon
  onPressPolygon = () => {
    let area = calculateArea(this.state.poly)
    let center = findCenter(this.state.poly, " this is center")
    area = area.toFixed(2)
    let { latitude, longitude } = center
    Alert.alert(
      'Area', 
      `The area of this sector is: ${area} sq. meters and the center is ${latitude.toFixed(5)} ${longitude.toFixed(5)}`)
    this.setState({
      area: area
    })
  }

  render() {
    return (
      <>
        <MapView
          style = {styles.mapStyle}
          provider = {MapView.PROVIDER_GOOGLE}
          initialRegion = {this.state.region}
          showsPointsOfInterest={false}
          showsBuildings={false}
          onRegionChangeComplete = {
            region => {
              this.setState({region});
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPoiClick = {(e) => {
            this.state.polygon ?
            console.log(e) :
            this.addPoints(e)
            }
          }
          onPress = {(e) => {
            this.state.polygon ?
            console.log(e) :
            this.addPoints(e)
            }
          }
        >
        {this.state.showMarks ? 
        this.state.polygon ? 
        <MapView.Polygon
          coordinates={this.state.poly}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          tappable= {true}
          onPress = {() => this.onPressPolygon()}
          fillColor="#0000FF"
          fillOpacity={0.35} /> :
        <MapView.Polyline 
            coordinates={this.state.poly}
            strokeWidth={3}
            strokeColor="red"/> :
            null
          }
        {this.state.points.map((point, index) => (
        <MapView.Marker 
          key={index} 
          draggable
          opacity={0.5}
          onDrag={(e) => this.changeCoordinate(e, index)}
          coordinate={point.latlng}
        /> ))
        }
        </MapView>
        <View style = {styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.togglePolygon()}
            style={
              [styles.button,
               styles.bubble]
            }
          >
          <Text style = {{color: 'white', fontSize: 12}}>
            Toggle Lines/Polygon
          </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.clear()}
            style={
              [styles.button,
               styles.bubble]
            }
          >
          <Text style = {{color: 'white', fontSize: 12}}>
            Clear the Map
          </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  poly: {
    color: 'red'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 50,
    backgroundColor: 'transparent',
    marginBottom: 550,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(214, 39, 39, 0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
  },
});