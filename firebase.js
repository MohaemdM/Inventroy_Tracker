// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfQDGzU7gGMmqgNyVJjOYbgiy4ESd2nko",
  authDomain: "inventory-done.firebaseapp.com",
  projectId: "inventory-done",
  storageBucket: "inventory-done.appspot.com",
  messagingSenderId: "537902725048",
  appId: "1:537902725048:web:f81306c42b3a3c0222414d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
