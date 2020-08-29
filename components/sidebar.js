import React, {useRef, useEffect}  from 'react';
import { Dimensions, StatusBar, Animated } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { setData } from "./../redux/action";
import {View, Text, Touch} from "./../ui-kit";
import { Actions } from 'react-native-router-flux';
import { Color } from '../global/util';
const width = Math.round(Dimensions.get('window').width);  
const height = Math.round(Dimensions.get('window').height);  

let arrayOfItems = [
    {id : "MapView", name : "MapView"},
    {id : "howItWorks", name : "How it Works"},
    {id : "history", name : "History"},
    {id : "aboutUs", name : "About Us"},
    {id : "share", name : "Share"},
    {id : "contactUs", name : "Contact Us"},
    {id : "UserDetail", name : "Edit Details"},
    {id : "complaint", name : "Complaint"}
]

export default () => {

    const widthAnimation = useRef(new Animated.Value(0)).current 
    useEffect(() => {
        Animated.timing(
          widthAnimation,
          {
            toValue: width * 0.8,
            duration: 2000,
          }
        ).start();
      }, [])

    const dispatch = useDispatch()
    const setDataAction = (arg) => dispatch(setData(arg))

    let { sidebar, userInfo } = useSelector(state => {
        return {
            sidebar: state.testReducer.sidebar,
            userInfo: state.testReducer.userInfo
        }
    }) || {};

    if(!sidebar.show)
      return null;

    return <View a le={0} to={0} w={width} h={height} mt={StatusBar.currentHeight} c={'rgba(52, 52, 52, 0.8)'}>
        <Animated.View style={{
                height: '100%',
                backgroundColor : "#bbb",
                width: widthAnimation, 
            }}>
                <View jc h={'100%'}>
                    {
                        arrayOfItems.map((item, index) => {
                            if(userInfo.userType == "driver" && item.id == "UserDetail")
                                return null;
                            return ( 
                                <Touch g key={index} jc boc={'#000'} bw={1} bw={0.5} onPress={() => {
                                    Actions[item.id]();
                                    setDataAction({sidebar : { show : false}});
                                }} c={Color.white} t={item.name}/>
                            );
                        })
                    }
                </View>
                <Touch a to={10} w={24} h={24} ri={10} jc ai t={"X"} s={24} b
                    onPress={() => setDataAction({sidebar : { show : false}})}/>
        </Animated.View>
    </View>
}