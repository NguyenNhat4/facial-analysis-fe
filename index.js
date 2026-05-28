// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
let analytics;
// ONLY initialize if we are in the browser
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { analytics };
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCapW8XrR7aNfv_hI307thJ6ord8oqzaI",
  authDomain: "facial-harmony-analysis.firebaseapp.com",
  projectId: "facial-harmony-analysis",
  storageBucket: "facial-harmony-analysis.firebasestorage.app",
  messagingSenderId: "559531531633",
  appId: "1:559531531633:web:2d3cd97312530296c3aad0",
  measurementId: "G-5MVWBDBBNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);