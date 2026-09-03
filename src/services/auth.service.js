// Auth Service
// Handles all authentication logic with Firebase Auth
import { auth } from "../lib/firebase/config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const loginUser = async (email, password) => {
  // TODO: uncomment once Firebase is fully configured
  // return await signInWithEmailAndPassword(auth, email, password);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const logoutUser = async () => {
  // return await signOut(auth);
  return new Promise((resolve) => setTimeout(resolve, 500));
};
