
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwTFtU9srNJqO6qK4FJLBEKCNWVOOXCOs",
  authDomain: "tip-tours-df5b5.firebaseapp.com",
  projectId: "tip-tours-df5b5",
  storageBucket: "tip-tours-df5b5.appspot.com",
  messagingSenderId: "314938900863",
  appId: "1:314938900863:web:815ccfbdecc43622ae1a4a",
  measurementId: "G-HWR3HSLM9Y"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        await setPersistence(auth,browserLocalPersistence)
        await signInWithPopup(auth, googleProvider);
    } catch (err) {
        console.error(err);
    }
};

const logout = () => {
    signOut(auth);
};

const isLogIn = () => {
    return auth.currentUser !== null
}

const getUser = () => {
    return auth.currentUser
}

export {
    auth,
    signInWithGoogle,
    logout,
    isLogIn,
    getUser,
};