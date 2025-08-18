import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEwwlGGQmzzWRQsdWW_6dANdtllZ0K5-o",
  authDomain: "namu-fullstack-app.firebaseapp.com",
  projectId: "namu-fullstack-app",
  storageBucket: "namu-fullstack-app.firebasestorage.app",
  messagingSenderId: "958663187891",
  appId: "1:958663187891:web:4fd5e633b7d9dee09dffc6",
  measurementId: "G-VKFSVTSDBL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
