import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { View } from "./../ui-kit";
import orangeMarkerImg from '../assets/car.png'
import { getDriverLocations } from "./../repo/repo";

export default props => {

    const [driverLocations, setDriverLocations] = useState({});

    useEffect(() => {
        getLocations();
    }, [props.isDriver, props.userInfo.areaCode]);
    
    getLocations = async () => {
        if(!props.userInfo.areaCode)
            return;
        let driverRef = getDriverLocations(props.userInfo.areaCode);
        driverRef.on('value', (data) => {
            setDriverLocations(data.val());
        });
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