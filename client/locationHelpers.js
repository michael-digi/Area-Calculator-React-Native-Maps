import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import haversine from 'haversine-distance';
import axios from 'axios';
import { isPointInPolygon } from 'geolib';

//------------------------------------------------------------------------//
export function calculateArea(locations) {
  if (!locations.length) {    
      return 0;
  }
  if (locations.length < 3) {
    return 0;
  }
  let radius = 6371000;

  const diameter = radius * 2;
  const circumference = diameter * Math.PI;
  const listY = [];
  const listX = [];
  const listArea = [];
  // calculate segment x and y in degrees for each point

  const latitudeRef = locations[0].latitude;
  const longitudeRef = locations[0].longitude;
  for (let i = 1; i < locations.length; i++) {
    let latitude = locations[i].latitude;
    let longitude = locations[i].longitude;
    listY.push(calculateYSegment(latitudeRef, latitude, circumference));
    listX.push(calculateXSegment(longitudeRef, longitude, latitude, circumference));
  }

    // calculate areas for each triangle segment
  for (let i = 1; i < listX.length; i++) {
    let x1 = listX[i - 1];
    let y1 = listY[i - 1];
    let x2 = listX[i];
    let y2 = listY[i];
    listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));

    }
  // sum areas of all triangle segments
  let areasSum = 0;
  listArea.forEach(area => areasSum = areasSum + area)
  
  // get abolute value of area, it can't be negative
  let areaCalc = Math.abs(areasSum);// Math.sqrt(areasSum * areasSum);  
  return areaCalc;
}

function calculateAreaInSquareMeters(x1, x2, y1, y2) {
  return (y1 * x2 - x1 * y2) / 2;
}
function calculateYSegment(latitudeRef, latitude, circumference) {
  return (latitude - latitudeRef) * circumference / 360.0;
}
function calculateXSegment(longitudeRef, longitude, latitude, circumference)     {
  return (longitude - longitudeRef) * circumference * Math.cos((latitude * (Math.PI / 180))) / 360.0;
}
//------------------------------------------------------------------------//
export function calculatePerimeter(coordinates) {
  let perimeter = 0;
  let coordinatesLength = coordinates.length
  for (let i = 1; i < coordinatesLength; i ++) {
    perimeter += haversine(coordinates[i-1], coordinates[i])
  }
  perimeter += haversine(coordinates[0], coordinates[coordinatesLength - 1])
  return perimeter
}
//------------------------------------------------------------------------//
export function findMinRadius(coordinates) {
  let perimArray = []
  let coordinatesLength = coordinates.length
  for (let i = 1; i < coordinatesLength; i ++) {
    perimArray.push(haversine(coordinates[i-1], coordinates[i]))
  }
  perimArray.push(haversine(coordinates[0], coordinates[coordinatesLength - 1]))
  return (Math.min(...perimArray))
}
//------------------------------------------------------------------------//
export function findMaxRadius(coordinates) {
  let perimArray = []
  let coordinatesLength = coordinates.length
  for (let i = 1; i < coordinatesLength; i ++) {
    perimArray.push(haversine(coordinates[i-1], coordinates[i]))
  }
  perimArray.push(haversine(coordinates[0], coordinates[coordinatesLength - 1]))
  return (Math.max(...perimArray) / 1.9)
}
//------------------------------------------------------------------------//
export function findCenter(coordinates) {
  let x = coordinates.map(c => c.latitude)
  let y = coordinates.map(c => c.longitude)

  let minX = Math.min.apply(null, x)
  let maxX = Math.max.apply(null, x)

  let minY = Math.min.apply(null, y)
  let maxY = Math.max.apply(null, y)

  return {
    latitude: (minX + maxX) / 2,
    longitude: (minY + maxY) / 2
  }
}
//------------------------------------------------------------------------//
export function newCoordinates(poly, e, index) {
  let newCoord = e.nativeEvent.coordinate;
    let newEditing = Object.assign({}, poly);
    let newCoordinates = Object.assign({},newEditing);
    newCoordinates[index] = newCoord;
    newEditing = newCoordinates;
    let transformedCoords = Object.keys(newEditing).map(function (key)
      { return newEditing[key]; });
    
    return transformedCoords;
}
//------------------------------------------------------------------------//
export async function getLocationAsync() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      errorMessage: 'Permission to access location was denied',
    });
  }
  let location = await Location.getCurrentPositionAsync({
  
  });
  let { latitude, longitude } = location.coords
  let initialLocation = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }
  return initialLocation;
};
//------------------------------------------------------------------------//
export async function getPlacesInPolygon(coordinates, radius, polygon) {
  let conqueredPlaces = 
  await axios.get('http://172.20.10.2:5000/searchNearby', {
    params: {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      radius: radius
    }
  })
  let conqueredPlacesFiltered = conqueredPlaces.data
    .filter(points => isPointInPolygon(points.geometry.location, polygon))
    .map(getDetails)
  let conqueredPlacesNotFiltered = conqueredPlaces.data
    .map((name => name.name))

  console.log(conqueredPlacesFiltered)
}

function getDetails(place) {
  return {
    name: place.name,
    geometry: place.geometry,
    place_id: place.place_id,
    types: place.types,
    vicinity: place.vicinity,
    icon: place.icon
  }
}


    // const filteredResults = response.data.results
    //   .map(result => result.name)
    //   .filter(name => name !== "New York" && name !== 'Queens')



