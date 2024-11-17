// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-2122cd.firebaseapp.com",
    projectId: "mern-blog-2122cd",
    storageBucket: "mern-blog-2122cd.appspot.com",
    messagingSenderId: "643321880399",
    appId: "1:643321880399:web:a675c6ab26823a85736f3a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
