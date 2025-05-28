import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfvQ1He6UsDrJ3BBq1SoYLY03VrYvySc8",
  authDomain: "azaleabau-758b5.firebaseapp.com",
  projectId: "azaleabau-758b5",
  storageBucket: "azaleabau-758b5.firebasestorage.app",
  messagingSenderId: "853635578431",
  appId: "1:853635578431:web:30d7b6728b5eb07e33968a",
  measurementId: "G-MJNJ2LK708",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // 🔥 Firestore database reference
