// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsM-Ln4dexUKh_hucJG54C5Asch0pmKM4",
  authDomain: "nlnext-go.firebaseapp.com",
  projectId: "nlnext-go",
  storageBucket: "nlnext-go.appspot.com",
  messagingSenderId: "1039691952190",
  appId: "1:1039691952190:web:c0527d244c93d78410e16f",
  measurementId: "G-YKJLJT6SXZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create a Firestore document for the new user
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date(),
    });

    await updateProfile(user, { displayName: name });
    return userCredential;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    throw new Error(error.message);
  }
};
