import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKEizoP13Mxa4ibyrvufLyypdP34-CLg4",
  authDomain: "quiz-94331.firebaseapp.com",
  databaseURL: "https://quiz-94331-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quiz-94331",
  storageBucket: "quiz-94331.firebasestorage.app",
  messagingSenderId: "529320135827",
  appId: "1:529320135827:web:5d277b12f585fa48435166",
  measurementId: "G-RYGM42CPBW"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, onValue, update };
