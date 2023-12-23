import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
import { getFirestore } from '@firebase/firestore'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Swal from "sweetalert2";

const firebaseConfig = {
  apiKey: "AIzaSyBWYRoM_vCadvfKlOuR87ymb6xMcVE_xAY",
  authDomain: "deans-office-2.firebaseapp.com",
  projectId: "deans-office-2",
  storageBucket: "deans-office-2.appspot.com",
  messagingSenderId: "199373902935",
  appId: "1:199373902935:web:6d6c50f423dd99abe8ff12"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

//Dagdag
export const db = initializeFirestore(app, {useFetchStreams: false});

export const auth = getAuth(app)


