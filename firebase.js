// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHaJPFOYlDrAJFQQZRDXtPilshSKgZWg0",
  authDomain: "inventory-managment-7bbc4.firebaseapp.com",
  projectId: "inventory-managment-7bbc4",
  storageBucket: "inventory-managment-7bbc4.appspot.com",
  messagingSenderId: "1007902625248",
  appId: "1:1007902625248:web:70319f22f14345197e6f85",
  measurementId: "G-97VB0P2970"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}