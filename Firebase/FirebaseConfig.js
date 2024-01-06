import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDYDPU_HdkLyI9Oc0-ux2cyKXXORrjyC4o",
  authDomain: "ssk-bharat.firebaseapp.com",
  projectId: "ssk-bharat",
  storageBucket: "ssk-bharat.appspot.com",
  messagingSenderId: "498107910257",
  appId: "1:498107910257:web:33a9ac881f4324387873d0",
  measurementId: "G-87EYD9XZS6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app;