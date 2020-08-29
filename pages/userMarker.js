import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { View } from "./../ui-kit";
import garbageTruckImg from '../assets/car.png'
import { getDriverLocations } from "./../repo/repo";
import { distanceBetweenLatLong, sendPushNotification } from "./../global/notif";
import { useSelector } from "react-redux";

export default props => {

    const [driverLocations, setDriverLocations] = useState({});
    let userCoords = useSelector(state => state.testReducer.coords) || {};

    useEffect(() => {
        getLocations();
    }, [props.isDriver, props.userInfo.areaCode]);
    
    getLocations = async () => {
        if(!props.userInfo.areaCode)
            return;
        let driverRef = getDriverLocations(props.userInfo.areaCode);
        driverRef.on('value', (data) => {
            setDriverLocations(data.val());
            calculateDriverLocations(data.val());
        });
    }

    calculateDriverLocations = drivers => {
        console.log(drivers, userCoords);
        if(!userCoords.longitude)
            return;
        for(let key in drivers) {
            let value = drivers[key];
            let distance = distanceBetweenLatLong(userCoords.latitude, userCoords.longitude, value.location.real_time.lat, value.location.real_time.long, "K");
            if(distance < 1) {
                sendPushNotification(props.userInfo.firebaseToken);
            }
        }
    }

    if(driverLocations === null || Object.keys(driverLocations).length === 0)
        return null;

    return ( <View> 
        {
            Object.entries(driverLocations).map((item, index) => (
                <View key={index}>
                    <MapView.Marker
                        coordinate={{
                            latitude: item[1].location?.real_time?.lat,
                            longitude: item[1].location?.real_time?.long
                        }}
                        image={garbageTruckImg}
                        />
                </View>)
            )
        }
    </View>
    );
}