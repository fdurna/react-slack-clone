import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCWd5JLW5gswBI0dNvp57yaQi9bUZ-1lk0",
    authDomain: "react-chat-cafbf.firebaseapp.com",
    databaseURL: "https://react-chat-cafbf.firebaseio.com",
    projectId: "react-chat-cafbf",
    storageBucket: "react-chat-cafbf.appspot.com",
    messagingSenderId: "423589169785",
    appId: "1:423589169785:web:a6647c42f48f1b8384a2a8",
    measurementId: "G-2KXMB5P97F"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

  export default firebase;