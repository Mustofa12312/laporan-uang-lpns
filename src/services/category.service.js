import { db } from "../lib/firebase/config";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const COLLECTION_NAME = "categories";

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...categoryData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (id, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Soft delete recommended
export const deleteCategory = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Soft delete: status = 'INACTIVE' or 'DELETED'
    await updateDoc(docRef, { status: "DELETED", deletedAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
