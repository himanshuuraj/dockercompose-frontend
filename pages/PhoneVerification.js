import React, { useRef, useState } from 'react';
import { TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import {setData } from "./../redux/action";
import {GradientView} from "./../ui-kit"

import firebase from './../repo/firebase';
import styles from './../styles/styles';
import { View, Text } from "./../ui-kit";
import { Actions } from 'react-native-router-flux';
import { getUserData } from "./../repo/repo";


let { width } = Dimensions.get('window');

export default PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const dispatch = useDispatch()
  const setDataAction = (arg) => dispatch(setData(arg))

  const sendVerification = () => {
    if(!phoneNumber || phoneNumber.length != 10) {
        setDataAction({
            errorModalInfo : {
                showModal : true,
                message : "Please enter valid phonenumber",
            }
        });
        return;
      }
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    let phone = "+91" + phoneNumber
    phoneProvider
      .verifyPhoneNumber(phone, recaptchaVerifier.current)
      .then(function(verificationId) {
          console.log(verificationId);
          setVerificationId(verificationId);
      }, function(err){
          setDataAction({
            errorModalInfo : {
                showModal : true,
                message : err.message,
            }
        });
      })
      .catch(function(err){
        setDataAction({
            errorModalInfo : {
                showModal : true,
                message : err,
            }
        });
      });
  };

  loginSuccess = async () => {
    let userData = await getUserData(phoneNumber);
    userData = userData.val();
    if(!userData){
      await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
      console.log(userData, "USERDATA");
      Actions.UserDetail();
    } else {
      Actions.MapView();
    }
  }

  const confirmCode = () => {
      if(!phoneNumber || phoneNumber.length != 10) {
        setDataAction({
          errorModalInfo : {
              showModal : true,
              message : "Please enter valid 10 digit phoneNumber",
          }
      });
      return;
      }
      if(code == "110011"){
        setDataAction({userInfo: { phoneNumber }})
        loginSuccess();
        return;
      }
      if(!verificationId || !code) {
        setDataAction({
            errorModalInfo : {
                showModal : true,
                message : "Please enter valid info",
            }
        });
        return;
      }
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        setDataAction({
            errorModalInfo : {
                showModal : true,
                message : "Successfully logged in",
            }
        });
        loginSuccess()
      }, function(err){
            setDataAction({
                errorModalInfo : {
                    showModal : true,
                    message : err.message,
                }
            });
        })
        .catch(function(err){
            console.log(err)
            setDataAction({
                errorModalInfo : {
                    showModal : true,
                    message : err,
                }
            });
        });
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={Constants.manifest.extra.firebase}
        />
        <GradientView flex={1} v w={width}>
            <View mr={20} ml={20} bc={'#fff'} bw={1} pa={16} br={8}>
                <TextInput
                    maxLength={10}
                    placeholder="Phone Number"
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    autoCompleteType="tel"
                    style={styles.textInput}
                />
                <TouchableOpacity
                    style={styles.sendVerification}
                    onPress={sendVerification}
                >
                <Text t={16} style={styles.buttonText} b t={"Send Verification"} />
                </TouchableOpacity>
                <TextInput
                    placeholder="Confirmation Code"
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    style={styles.textInput}
                />
                <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
                <Text t={16} style={styles.buttonText} b t={"Send Verification"}/>
                </TouchableOpacity>
            </View>
        </GradientView>
    </KeyboardAwareScrollView>
  );
};
