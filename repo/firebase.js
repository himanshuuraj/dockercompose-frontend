// import * as firebase from 'firebase';


// var firebaseConfig = {
//     apiKey: "AIzaSyBbbVxbYovm9y89nFZbbMPTL4TygadG4pA",
//     authDomain: "ainaa-a27c5.firebaseapp.com",
//     databaseURL: "https://ainaa-a27c5.firebaseio.com",
//     projectId: "ainaa-a27c5",
//     storageBucket: "ainaa-a27c5.appspot.com",
//     messagingSenderId: "312253846320",
//     appId: "1:312253846320:web:cb0ce51fc16c70ae742ef5",
//     measurementId: "G-4KGQX82H92"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);

// export default firebase;

import Constants from 'expo-constants';
import * as firebase from 'firebase';
import '@firebase/auth';

firebase.initializeApp(Constants.manifest.extra.firebase);

export default firebase;