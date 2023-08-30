// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBayKZNtBddxn9g6t71P5CRIcsGSy5eOK4",
  authDomain: "fir-todo-b5002.firebaseapp.com",
  projectId: "fir-todo-b5002",
  storageBucket: "fir-todo-b5002.appspot.com",
  messagingSenderId: "769940109681",
  appId: "1:769940109681:web:daabe726c2e9e39a669ed0",
  measurementId: "G-KDPLEE9LZQ"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAVMPjGnu-wJ4s69ly-5Hsois-T7NCRhUM",
//   authDomain: "olive-tree-restaurant.firebaseapp.com",
//   databaseURL: "https://olive-tree-restaurant-default-rtdb.firebaseio.com",
//   projectId: "olive-tree-restaurant",
//   storageBucket: "olive-tree-restaurant.appspot.com",
//   messagingSenderId: "1075365647641",
//   appId: "1:1075365647641:web:7aea2c92b6be6309a56188",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth();
