// User Service
// Handles fetching and managing user profiles and roles
import { db } from "../lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

const COLLECTION_NAME = "users";

export const getUsers = async () => {
  // TODO: uncomment once Firebase is fully configured
  // return await getDocs(collection(db, COLLECTION_NAME));
  return new Promise((resolve) => setTimeout(() => resolve([]), 1000));
};
