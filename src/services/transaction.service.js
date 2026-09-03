// Transaction Service
// Handles CRUD operations for transactions with Firestore
import { db } from "../lib/firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

const COLLECTION_NAME = "transactions";

export const addTransaction = async (data) => {
  // TODO: uncomment once Firebase is fully configured
  // return await addDoc(collection(db, COLLECTION_NAME), {
  //   ...data,
  //   createdAt: new Date()
  // });
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const getTransactions = async (filters = {}) => {
  // return await getDocs(collection(db, COLLECTION_NAME));
  return new Promise((resolve) => setTimeout(() => resolve([]), 1000));
};
