// Auth Service
// Handles all authentication logic with Firebase Auth
import { auth } from "../lib/firebase/config";
import { signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

export const loginUser = async (email, password, rememberMe = false) => {
  try {
    // Set persistence based on "remember me" choice
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage = "Terjadi kesalahan saat login.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = "Email atau password salah.";
    }
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

export const changePassword = async (newPassword) => {
  const { updatePassword } = await import("firebase/auth");
  if (!auth.currentUser) throw new Error("Tidak ada user aktif");
  await updatePassword(auth.currentUser, newPassword);
};

