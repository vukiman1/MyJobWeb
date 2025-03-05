import { initializeApp } from 'firebase/app';
import { serverTimestamp, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQEnkCoqlYeTJYjzmP09WGdBLQYfzWHsY",
  authDomain: "vieclam365-c0e7c.firebaseapp.com",
  projectId: "vieclam365-c0e7c",
  storageBucket: "vieclam365-c0e7c.firebasestorage.app",
  messagingSenderId: "1025345391934",
  appId: "1:1025345391934:web:993ec6ab53818b42f3306f",
  measurementId: "G-WNCN18N59N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

export { serverTimestamp };
export default db;
