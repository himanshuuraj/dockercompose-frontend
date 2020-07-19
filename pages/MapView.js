import React, { Component, useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Dimensions, StatusBar, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { setData } from "./../redux/action";
import { useDispatch, useSelector } from 'react-redux';
import Header from "./../components/header";
import { Touch, View, Text } from "./../ui-kit";
import orangeMarkerImg from '../assets/car.png'
import { getDriverLocations, updateTruckLocationInAreaCode, updateUserLocation, updateTruckHistory, updateTruckLocations } from "./../repo/repo";

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
      console.log("Timer cleaned");
    }
  }, [isDriver]);

  getLocations = async () => {
    let locs = await getDriverLocations(userInfo.areaCode);
    console.log(locs, "LOCATION");
    let locations = locs.val();
    console.log(locations);
    setDriverLocations(locations);
  }

  getUserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    console.log("USERINFO", userInfo);
    userInfo = JSON.parse(userInfo);
    setUserInfo(userInfo);
    setIsDriver(userInfo.userType == "driver");
  }

  updateLocation = async () => {
    console.log("UPDATE - LOCATION");
    if(status !== "granted") 
      return;
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    if(isDriver && userInfo.truckId){
      updateTruckLocations(location.coords?.latitude, location.coords?.longitude, userInfo.truckId);
      updateTruckHistory(location.coords?.latitude, location.coords?.longitude, userInfo.truckId);
      updateTruckLocationInAreaCode(location.coords?.latitude, location.coords?.longitude, userInfo.areaCode, userInfo.phoneNumber);
      // console.log(locs);
      // setDriverLocations(locs);
    }else if(!isDriver && userInfo.phoneNumber){
      // updateUserLocation(location.coords?.latitude, location.coords?.longitude, userInfo.phoneNumber);
      // let locs = await getDriverLocations(userInfo.areaCode, userInfo.phoneNumber);
      // console.log(locs)
      // setDriverLocations({});
    }
  }

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   setStatus(status)
   updateLocation();
 };

 console.log("Render check")

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
          userInfo.userType == "driver" && (
            <View>
              <MapView.Marker
                  coordinate={location.coords}
                  title="My Marker"
                  description="Some description"
                  image={orangeMarkerImg}
                  />
            </View>
          )
        }
        {
          userInfo.userType !== "driver" && ( <View> 
            {
              Object.entries(driverLocations).map((item, index) => {
                console.log(item ,"ITEM");
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
          )
        }
      </MapView>
    </View>
  );
}