import firebase from "./../repo/firebase";

let dbRef = firebase.database().ref();

const getCurrentDate = () => {
    let date = new Date().toLocaleDateString()
    date = date.split("/").join("-");
    return date;
}

const updateUserLocation = (lat, long, phoneNumber) => {
    
    var locationRef = dbRef.child('users/'+ phoneNumber + "/location");
    let latLong = {
        lat : lat,
        long : long
    }
    locationRef.update(latLong).then(() => {}).catch(e => {})
}

const updateTruckLocationInAreaCode = (lat, long, areaCode, phoneNumber) => {
    var locationRef = dbRef.child('areaCode/'+ areaCode + "/" + getCurrentDate() + "/" + phoneNumber + "/location/real_time");
    let latLong = {
        lat : lat,
        long : long
    }
    locationRef.update(latLong).then(() => {}).catch(e => {})
}

const updateUserData = state => {
    var usersRef = dbRef.child('users/'+ state.phoneNumber + "/profile");
    return usersRef.update(state).then(() => {}).catch(e => {})
}

const updateTruckLocations = (lat, long, truckId) => {
    let latLong = {
        lat : lat,
        long : long
    }
    var usersRef = dbRef.child('trucks/real_time/'+ getCurrentDate() + "/" + truckId);
    return usersRef.update(latLong).then(() => { }).catch(e => { })
}

const updateTruckHistory = (lat, long, truckId) => {
    let latLong = {
        lat : lat,
        long : long
    }
    var usersRef = dbRef.child('trucks/history/'+ getCurrentDate() + "/" + truckId + "/" + new Date().getTime());
    return usersRef.update(latLong).then(() => {}).catch(() => {})
}

const getDriverLocations = (areaCode) => {
    return dbRef.child('areaCode/'+ areaCode + "/" + getCurrentDate());
}

const getUserData = phoneNumber => {
    var usersRef = dbRef.child('users/'+ phoneNumber + "/profile");
    return usersRef.once('value', data => data);
}

const getAllAreas = () => {
    var usersRef = dbRef.child('areas/');
    return usersRef.once('value', data => data);
} 

const updateUserInArea = userInfo => {
    var usersRef = dbRef.child('areaCode/'+ userInfo.areaCode + "/profile/" + userInfo.phoneNumber);
    return usersRef.update(userInfo).then(() => {}).catch(e => {})
}

export { updateUserLocation, updateUserData, getUserData, getAllAreas, updateTruckLocations, updateTruckHistory, getDriverLocations, updateTruckLocationInAreaCode, updateUserInArea }