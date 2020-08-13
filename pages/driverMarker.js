import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StatusBar, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { setData } from "./../redux/action";
import { useDispatch } from 'react-redux';
import Header from "./../components/header";
import { View, Text } from "./../ui-kit";
import orangeMarkerImg from '../assets/car.png';
import { updateTruckLocations, updateTruckHistory, updateTruckLocationInAreaCode } from "./../repo/repo";

export default props => {

    const [location, setLocation] = useState({coords: { latitude: 37.78825, longitude: -122.4324}});
    let userInfo = props.userInfo;

    useEffect(() => {
        var timer = setInterval(() => {
            updateLocation();
        }, 8000);
        return () => {
          clearInterval(timer);
        }
      }, [props.isDriver]);
    
    updateLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        updateTruckLocations(location.coords?.latitude, location.coords?.longitude, userInfo.truckId);
        updateTruckHistory(location.coords?.latitude, location.coords?.longitude, userInfo.truckId);
        updateTruckLocationInAreaCode(location.coords?.latitude, location.coords?.longitude, userInfo.areaCode, userInfo.phoneNumber);
    }
    
    return <View>
                <MapView.Marker
                    coordinate={location.coords}
                    title="My Marker"
                    description="Some description"
                    image={orangeMarkerImg}
                    />
            </View>
}