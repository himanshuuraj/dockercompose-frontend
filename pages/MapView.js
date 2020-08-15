import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StatusBar, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { setData } from "./../redux/action";
import { useDispatch } from 'react-redux';
import Header from "./../components/header";
import { View, Text } from "./../ui-kit";
import DriverMarker from "./driverMarker";
import UserMarker from "./userMarker";

export default () => {

  const [mapRegion, setMapRegion] = useState({ latitude: 20.9517, longitude: 85.0985, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  const [location, setLocation] = useState({coords: { latitude: 20.9517, longitude: 85.0985}});
  const [isDriver, setIsDriver] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const dispatch = useDispatch()

  useEffect(() => {
    getUserInfo();
    _getLocationAsync();
  }, []);

  getUserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    if(!userInfo) return;
    userInfo = JSON.parse(userInfo);
    setUserInfo(userInfo);
    setIsDriver(userInfo.userType === "driver");
  }

  toggleLoading = show => {
    dispatch(setData({"loading": {show}}));
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== "granted"){
      dispatch(setData({
        errorModalInfo : {
          showModal : true,
          message : "PLEASE GRANT LOCATION PERMISSION",
        }
      }));
      return;
    }
    toggleLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    toggleLoading(false);
  };

  let markerProps = {
    isDriver : isDriver,
    userInfo : userInfo
  }

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
          userInfo?.userType == "driver" ? <DriverMarker {...markerProps} /> : <UserMarker {...markerProps} />
        }
      </MapView>
    </View>
  );
}