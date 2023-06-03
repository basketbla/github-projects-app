// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqm0oHhYfOnBsfLZfB1XtUD1lrw9u7OZs",
  authDomain: "github-preview-generator.firebaseapp.com",
  // authDomain: "auth.localhost:3000",
  projectId: "github-preview-generator",
  storageBucket: "github-preview-generator.appspot.com",
  messagingSenderId: "638832855927",
  appId: "1:638832855927:web:6b7cb88b5b332822146f72",
  measurementId: "G-QC5B83ZSND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();