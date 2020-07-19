import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import {} from "./../redux/constants";
import { getApiCall, postApiCall, deleteApiCall, putApiCall } from "./../global/request";
import * as Api from "./../global/api";
import {AsyncStorage} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
    setData
} from "./../redux/action";

const mySaga = [
];

export default mySaga;