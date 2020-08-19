import React, {useState, useEffect, useReducer}  from 'react';
import { Dimensions, StatusBar, Animated, AsyncStorage, Picker } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { setData } from "./../redux/action";
import { View, Text, Touch, TextInput } from "./../ui-kit";
import { Actions } from 'react-native-router-flux';
import { updateUserData, getAllAreas } from "./../repo/repo";

let { height } = Dimensions.get('window');

const initialState = {
    name : "",
    phoneNumber : "",
    email : "",
    city : "",
    state : "",
    pincode : "",
    userType : "",
    truckName : "",
    truckId : "",
    areaCode : ""
  }
  
  const reducer = (state, { field, value }) => {
    if(field == "userInfo"){
      return {
        ...state,
        ...value
      }
    }
    if(field.includes(".")){
      let field2 = field.split(".")[1];
      let field1 = field.split(".")[0];
      let obj = {};
      obj[field1] = state[field1];
      obj[field1] = { ...obj[field1], [field2]: value };
      obj[field1][field2] = value;
      return {
        ...state,
        ...obj
      }
    }
    return {
      ...state,
      [field]: value
    }
  }

export default () => {

    const [state, dispatchStateAction] = useReducer(reducer, initialState);
    const [areas, setAreas] = useState([]);

    const dispatch = useDispatch()
    const setDataAction = (arg) => dispatch(setData(arg))

    useEffect(() => {
        getAreas();
    }, [areas.length])

    getAreas = async () => {
        areaList = await getAllAreas();
        setAreas(areaList.val());
    }
    
    formOnChangeText = (field, value) => {
        dispatchStateAction({ field, value });
    }

    showErrorModalMsg = (message, title = "Message") => {
        setDataAction({ 
            errorModalInfo : {
                showModal : true,
                title : title,
                message : message
            }
        })
    };

    validateUserInfo = () => {
        let message = "Please enter ";
        for(let key in initialState) {
            if(state.userType !== "driver" &&
                (key == "truckId" || key == "truckName"))
                    continue;
            if(!state[key]){
                message += key
                showErrorModalMsg(message);
                return true
            }
        }
        return false
    }

    updateUserInfo = async () => {
        try {
            let userInfo = state;
            userInfo["firebaseToken"] = await AsyncStorage.setItem("firebaseToken");
            await updateUserData(userInfo);
            await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
            Actions.MapView()
            setDataAction({ userInfo });
        }catch(err) {
            showErrorModalMsg("Error while updating userData");
        }
    }

    driverLayout = () => {
        if (state.userType !== "driver") return null;
        return <View>
            <Text t={'Truck Name'} />
            <TextInput ml nl={2} uc={"#bbb"} ph="Truck Name" pl={16}
                onChangeText={formOnChangeText} name={'truckName'}
                value={state.truckName}/>
            <Text t={'Truck Number'} />
            <TextInput ml nl={2} uc={"#bbb"} ph="Truck Number" pl={16}
                onChangeText={formOnChangeText} name={'truckId'}
                value={state.truckId}/>
        </View>;
    }

    return <View mt={StatusBar.currentHeight} pl={16} pr={16}>
        <View jc ai h={height}>
            <Text b s={18} t={"DETAILS"} />
            <View pt={16} pb={8} ph={8} w={'100%'}>
                <Text t={'Name'} />
                <TextInput ml nl={2} uc={"#bbb"} ph="FirstName LastName" pl={16}
                onChangeText={formOnChangeText} name={'name'}
                value={state.name}/>
                <Text t={'PhoneNumber'} />
                <TextInput ml nl={2} uc={"#bbb"} ph="1234567890" pl={16}
                onChangeText={formOnChangeText} name={'phoneNumber'}
                k={"numeric"} maxLength={10}
                value={state.phoneNumber}/>
                <Text t={'Email'} />
                <TextInput ml nl={2} uc={"#bbb"} ph="abc@def.com" pl={16}
                onChangeText={formOnChangeText} name={'email'}
                value={state.email}/>
                <Text t={'City'} />
                <TextInput ml nl={2} uc={"#bbb"} ph="Bangalore" pl={16}
                onChangeText={formOnChangeText} name={'city'}
                value={state.city}/>
                <Text t={'State'} />
                <TextInput ml nl={2} uc={"#bbb"} ph="State" pl={16}
                onChangeText={formOnChangeText} name={'state'}
                value={state.state}/>
                <Text t={'Pincode'} />
                <TextInput ml nl={2} uc={"#bbb"} ph="Pincode" pl={16}
                onChangeText={formOnChangeText} name={'pincode'}
                k={"numeric"}
                value={state.pincode}/>

                <Picker
                    selectedValue={state.areaCode}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) => formOnChangeText("areaCode", itemValue)}
                >
                    {
                        areas.map((item, index) => {
                            return <Picker.Item key={index} label={item.value} value={item.id} />
                        })
                    }
                </Picker>
                
                <Text t={'User or Driver'} />
                <Picker
                    selectedValue={state.userType}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) => formOnChangeText("userType", itemValue)}
                >
                    <Picker.Item label="User" value="user" />
                    <Picker.Item label="Driver" value="driver" />
                </Picker>
                {/* <TextInput ml nl={2} uc={"#bbb"} ph="User/Driver" pl={16}
                onChangeText={formOnChangeText} name={'userType'}
                value={state.userType}/> */}
                {
                    driverLayout()
                }
                <Touch g w={'100%'} mb={16} br={4}
                    onPress={() => {
                        if(!validateUserInfo()){
                            updateUserInfo();
                        }
                    }} s={16} c={"#fff"} t={'SUBMIT'}/>
            </View>
        </View>
    </View>
}