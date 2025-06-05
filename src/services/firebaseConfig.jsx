// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEK3JxFvviFYAo7vrKiYOAJV3ipriertw",
  authDomain: "plannerai-615cd.firebaseapp.com",
  projectId: "plannerai-615cd",
  storageBucket: "plannerai-615cd.firebasestorage.app",
  messagingSenderId: "718728520753",
  appId: "1:718728520753:web:6a5d97fe99e34e72ad6110",
  measurementId: "G-CJ6WDSMZ7E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);