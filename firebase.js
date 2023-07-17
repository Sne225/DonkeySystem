// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPn8Y47KaPBy8dppFf7SZ5Ni5cUMJ1XwY",
  authDomain: "donkeysystem-6b9fc.firebaseapp.com",
  projectId: "donkeysystem-6b9fc",
  storageBucket: "donkeysystem-6b9fc.appspot.com",
  messagingSenderId: "311146237020",
  appId: "1:311146237020:web:7de2c6d0f9bb5d020eea99"
};
;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };