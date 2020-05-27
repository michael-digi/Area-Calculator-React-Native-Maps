import React from 'react';
import { Fragment } from 'react'
import MapView from 'react-native-maps';
import { Alert } from 'react-native';
import { TouchableOpacity, StyleSheet, Text, View, Platform } from 'react-native';
import { calculateArea, 
         calculatePerimeter, 
         findCenter, 
         newCoordinates, 
         findMinRadius,
         findMaxRadius,
         getPlacesInPolygon } from './locationHelpers';
import { setTerritoryInfo } from './actions';
import { connect } from 'react-redux';
import styles from './Map.component.style.js';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { Pedometer } from "expo-sensors";
import customStyle1 from './GoogleMapStyles';
import customStyle2 from './GoogleMapStyles2';

const LOCATION_TASK_NAME = 'background-location-task';
let trackLocation;

class Map extends React.Component {
  componentDidMount(){
    this.props.setTerritoryInfo({
      area: 0, 
      perimeter: 0, 
      center: {
        latitude: 0, 
        longitude: 0
      }
    })
  }
  
  state = {
    points: [], poly: [], polygon: false, showMarks: true,
    region: this.props.initialLocation,
    lineOrPolygon: 'Use Polygon',
    clearMapOrEndRoute: 'Clear Map',
    radius: 0
  }

  resetState = () => {
    this.setState({
      points: [], polygon: false, poly: [], showMarks: false,
      lineOrPolygon: 'Use Polygon',
    })
    this.props.setTerritoryInfo({area: 0, perimeter: 0, center: {latitude: 0, longitude: 0}})
  }

  calculateTerritoryInfo = () => {
    let area = calculateArea(this.state.poly)
    let perimeter = calculatePerimeter(this.state.poly)
    let center = findCenter(this.state.poly)
    let maxRadius = findMaxRadius(this.state.poly)
    this.setState({
      radius: maxRadius
    })
    return {area: _.round(area, 2), 
            perimeter: _.round(perimeter, 2), 
            center: center}
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
  clear = async () => {
    this.resetState()
  }
  
  //Toggle between Polylines and their equivalent Polygon
  togglePolygon = () => {
    if (this.state.poly.length === 0) {
      return
    }
    
    if (this.state.polygon){
      this.setState({
        polygon: !this.state.polygon,
        lineOrPolygon: 'Use Polygon'
      })
    }
    else {
      let territoryInfo = this.calculateTerritoryInfo()
      this.props.setTerritoryInfo({
        area: territoryInfo.area, 
        perimeter: territoryInfo.perimeter, 
        center: territoryInfo.center})
      
      this.setState({
        polygon: !this.state.polygon,
        lineOrPolygon: 'Use Lines'
      })
    }
  }

  deleteLastMarker = () => {
    let { poly, points } = this.state;
    if (poly.length > 3){
      this.setState({
        points: points.filter(
          element => points.indexOf(element) != points.length - 1),
        poly: poly.filter(
          element => poly.indexOf(element) != poly.length - 1)
      })}
    else if (points.length === 2) {
      this.setState({
        points: points.filter(
          element => points.indexOf(element) != points.length - 1),
        poly: poly.filter(
          element => poly.indexOf(element) != poly.length - 1),
        polygon: false,
        lineOrPolygon: 'Use Polygon',
        showMarks: false
      })
    }
    else {
      this.setState({
        points: points.filter(
          element => points.indexOf(element) != points.length - 1),
        poly: poly.filter(
          element => poly.indexOf(element) != poly.length - 1),
        polygon: false,
        lineOrPolygon: 'Use Polygon'
      })
    }
  }

  changeCoordinate = (e, index) => {
    let newCoords = newCoordinates(this.state.poly, e, index)
    this.setState({
      poly: newCoords
    })
  }

  newTerritoryInfo = () => {
    if (!this.state.polygon) {
      return
    }
    let territoryInfo = this.calculateTerritoryInfo()
    this.props.setTerritoryInfo({
      area: territoryInfo.area, 
      perimeter: territoryInfo.perimeter, 
      center: territoryInfo.center})
  }
  //Uses the calculateArea function imported in from helpers.js to compute the area
  //of the created Polygon
  onPressPolygon = () => {
    Alert.alert('Takeover', `Take over this area for ${_.round(this.props.territoryInfo.area * .45)} steps?`, [{ 
      text: 'Conquer', onPress: () => {
        getPlacesInPolygon(
          this.props.territoryInfo.center, 
          this.state.radius,
          this.state.poly)
        //this.trackUser()
      }
   }, { 
      text: 'Not yet', onPress: () => {
        return },
        style: 'cancel' } ])
  }

  render() {
    return (
      <Fragment>
        <MapView
          style = {styles.mapStyle}
          customMapStyle = {customStyle2}
          provider = {MapView.PROVIDER_GOOGLE}
          initialRegion = {this.state.region}
          onRegionChangeComplete = {
            region => {this.setState({region}) }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPoiClick = {(e) => {
            this.state.polygon ?
            console.log('pressed') :
            this.addPoints(e)}
          }
          onPress = {(e) => {
            this.state.polygon ?
            console.log('pressed') :
            this.addPoints(e)}
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
            draggable={true}
            opacity={0.5}
            onDrag={(e) => this.changeCoordinate(e, index)}
            onDragEnd={() => this.newTerritoryInfo()}
            pinColor='green'
            coordinate={point.latlng}>
          </MapView.Marker> ))}
        </MapView>
        
        <View style = {styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.togglePolygon()}
            style={
              [styles.button,
               styles.bubble]} >
            <Text style = {{color: 'white', fontSize: 12}}>
              {this.state.lineOrPolygon}
            </Text>
          </TouchableOpacity> 
          
          <TouchableOpacity
            onPress={() => this.clear()}
            style={
              [styles.button,
               styles.bubble]} >
            <Text style = {{color: 'white', fontSize: 12}}>
              Clear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.deleteLastMarker()}
            style={
              [styles.button,
               styles.bubble]} >
            <Text style = {{color: 'white', fontSize: 12}}>
              Delete Marker
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={{backgroundColor: 'black'}} id= "Debug Text">
          <Text style={{color: 'white'}}> Debug </Text>
          <Text style={{color: 'white'}}> TerritoryArea: {this.props.territoryInfo.area} </Text>
          <Text style={{color: 'white'}}> TerritoryCenterLatitude: {_.round(this.props.territoryInfo.center.latitude, 3)} </Text>
          <Text style={{color: 'white'}}> TerritoryCenterLongitude: {_.round(this.props.territoryInfo.center.longitude, 3)} </Text>
          <Text style={{color: 'white'}}> TerritoryPerimeter: {this.props.territoryInfo.perimeter}</Text>
        </View>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  initialLocation: state.initialLocation,
  territoryInfo: state.territoryInfo
})

const dispatch = {
  setTerritoryInfo
}

export default connect(mapStateToProps, dispatch)(Map)