// Transaction Service
// Handles CRUD operations for transactions with Firestore
import { db } from "../lib/firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";

const COLLECTION_NAME = "transactions";

export const addTransaction = async (data, user) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      createdBy: user?.uid || "UNKNOWN",
      createdByName: user?.name || "Unknown User"
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const updateTransaction = async (id, updates, user) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.uid || "UNKNOWN",
      updatedByName: user?.name || "Unknown User"
    });
    return true;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

export const deleteTransaction = async (id, user) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Soft delete implementation
    await updateDoc(docRef, {
      status: "DELETED",
      deletedAt: new Date().toISOString(),
      deletedBy: user?.uid || "UNKNOWN",
      deletedByName: user?.name || "Unknown User"
    });
    return true;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

