import React from 'react';
import { setData } from "./../redux/action";
import { useDispatch } from 'react-redux';
import { Touch, View, Text } from "./../ui-kit";

export default () => {

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