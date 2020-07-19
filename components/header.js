import React, { Component, useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Dimensions, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { setData } from "./../redux/action";
import { useDispatch } from 'react-redux';
import { Touch, View, Text } from "./../ui-kit";

export default App => {

 const dispatch = useDispatch()
 const setDataAction = (arg) => dispatch(setData(arg));

  return (
        <Touch col ai ml={16} pt={2} pb={2} mt={8} boc={'#000'} h={40} bw={1} w={40} br={5} mr={16} style={{justifyContent: 'space-around'}}
            onPress={()=> {
            setDataAction({sidebar : { show : true }});
            }}>
            <View w={32} h={2} c={'#000'}/>
            <View w={32} h={2} c={'#000'}/>
            <View w={32} h={2} c={'#000'}/>
        </Touch>
    );
}