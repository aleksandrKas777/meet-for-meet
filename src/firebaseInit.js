// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdm-NMWicucpA5orOV0ZqI-J13p3yRdaw",
    authDomain: "meetformeet-358112.firebaseapp.com",
    projectId: "meetformeet-358112",
    storageBucket: "meetformeet-358112.appspot.com",
    messagingSenderId: "104278876812",
    appId: "1:104278876812:web:97e1572990ea488f6211a9",
    measurementId: "G-FPFDM05X0Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
