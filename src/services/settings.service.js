import { db } from "../lib/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const updateGeneralSettings = async (settingsData) => {
  try {
    const docRef = doc(db, "settings", "general");
    await setDoc(docRef, settingsData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export const getGeneralSettings = async () => {
  try {
    const docRef = doc(db, "settings", "general");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};
