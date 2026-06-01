import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
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
export const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (only in the browser)
export let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
