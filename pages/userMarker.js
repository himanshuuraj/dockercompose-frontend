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
import { getDriverLocations } from "./../repo/repo";

export default props => {

    const [driverLocations, setDriverLocations] = useState({});
    let userInfo = props.userInfo;

    useEffect(() => {
        var timer = setInterval(() => {
            getLocations();
          }, 8000);
        return () => {
          clearInterval(timer);
        }
    }, [props.isDriver]);
    
    getLocations = async () => {
        let locations = await getDriverLocations(userInfo.areaCode);
        setDriverLocations(locations.val());
    }

    if(driverLocations === null || Object.keys(driverLocations).length === 0)
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