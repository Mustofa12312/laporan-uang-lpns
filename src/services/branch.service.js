import { db } from "../lib/firebase/config";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const COLLECTION_NAME = "branches";

export const getBranches = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export const addBranch = async (branchData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...branchData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...branchData };
  } catch (error) {
    console.error("Error adding branch:", error);
    throw error;
  }
};

export const updateBranch = async (id, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating branch:", error);
    throw error;
  }
};

export const deleteBranch = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status: "DELETED", deletedAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("Error deleting branch:", error);
    throw error;
  }
};
