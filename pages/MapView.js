import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StatusBar, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { setData } from "./../redux/action";
import { useDispatch } from 'react-redux';
import Header from "./../components/header";
import { View, Text } from "./../ui-kit";
import orangeMarkerImg from '../assets/car.png'
import { getDriverLocations, updateTruckLocationInAreaCode, updateTruckHistory, updateTruckLocations } from "./../repo/repo";

export default () => {

  const [mapRegion, setMapRegion] = useState({ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  const [location, setLocation] = useState({coords: { latitude: 37.78825, longitude: -122.4324}});
  const [status, setStatus] = useState("");
  const [isDriver, setIsDriver] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [driverLocations, setDriverLocations] = useState({});

  const dispatch = useDispatch()
  const setDataAction = (arg) => dispatch(setData(arg));

  useEffect(() => {
    getUserInfo();
    _getLocationAsync();
    var timer;
    if(isDriver){
      timer = setInterval(() => {
        updateLocation();
      }, 8000);
    }else{
      timer = setInterval(() => {
        getLocations();
      }, 8000);
    }
    return () => {
      clearInterval(timer);
    }
  }, [isDriver]);

  getLocations = async () => {
    let locations = await getDriverLocations(userInfo.areaCode);
    setDriverLocations(locations.val());
  }

  getUserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    setUserInfo(userInfo);
    setIsDriver(userInfo.userType == "driver");
  }

  updateLocation = async () => {
    if(status !== "granted") 
      return;
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    if(isDriver && userInfo.truckId){
      updateTruckLocations(location.coords?.latitude, location.coords?.longitude, userInfo.truckId);
      updateTruckHistory(location.coords?.latitude, location.coords?.longitude, userInfo.truckId);
      updateTruckLocationInAreaCode(location.coords?.latitude, location.coords?.longitude, userInfo.areaCode, userInfo.phoneNumber);
     }
  }

  driverMarker = () => {
    return (
      <View>
        <MapView.Marker
            coordinate={location.coords}
            title="My Marker"
            description="Some description"
            image={orangeMarkerImg}
            />
      </View>
    );
  }

  userMarker = () => {
    if(!driverLocations)
      return null;
    return ( <View> 
      {
        Object.entries(driverLocations).map((item, index) => {
          return <View key={index}>
            <MapView.Marker
                coordinate={{
                  latitude: item[1].location?.real_time?.lat,
                  longitude: item[1].location?.real_time?.long
                }}
                image={orangeMarkerImg}
                />
          </View>
        })
      }
      </View>
    );
  }

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   setStatus(status)
   updateLocation();
 };

  return (
    <View >
      <View row ai mt={StatusBar.currentHeight} c={"#fff"} w={"100%"} h={60} >
        <Header />
        <Text s={18} t={"Welcome"} />
      </View>
      <MapView
        style={{ alignSelf: 'stretch', height: '100%' }}
        region={{ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
        // onRegionChange={this._handleMapRegionChange}
      >
        { 
          userInfo.userType == "driver" ? driverMarker() : userMarker()
        }
      </MapView>
    </View>
  );
}