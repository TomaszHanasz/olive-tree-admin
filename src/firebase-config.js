// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8QixNrbmsIvUD33ClbbnLE1LjN6ly_gk",
  authDomain: "cafealif-473e9.firebaseapp.com",
  projectId: "cafealif-473e9",
  storageBucket: "cafealif-473e9.appspot.com",
  messagingSenderId: "39055977451",
  appId: "1:39055977451:web:8361ac9589f742d94487ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth();
