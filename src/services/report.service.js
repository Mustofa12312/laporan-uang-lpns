import { db } from "../lib/firebase/config";
import { collection, addDoc, getDocs, doc, writeBatch, query, where } from "firebase/firestore";

const ARCHIVES_COLLECTION = "archives";
const TRANSACTIONS_COLLECTION = "transactions";

export const closeBook = async (periodName, currentUser) => {
  try {
    // 1. Fetch all active transactions
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("status", "==", "ACTIVE")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Tidak ada transaksi aktif untuk ditutup.");
    }

    const activeTransactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Create Archive Document
    const archiveData = {
      periodName,
      closedAt: new Date().toISOString(),
      closedBy: currentUser?.uid || "UNKNOWN",
      closedByName: currentUser?.name || "Unknown User",
      transactionCount: activeTransactions.length,
      // Calculate totals for quick reporting
      totalIncome: activeTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpense: activeTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    };

    const archiveRef = await addDoc(collection(db, ARCHIVES_COLLECTION), archiveData);
    const archiveId = archiveRef.id;

    // 3. Batch update all active transactions to ARCHIVED
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(document => {
      const txRef = doc(db, TRANSACTIONS_COLLECTION, document.id);
      batch.update(txRef, {
        status: "ARCHIVED",
        archiveId: archiveId,
        archivedAt: new Date().toISOString()
      });
    });

    await batch.commit();
    return archiveId;

  } catch (error) {
    console.error("Error closing book:", error);
    throw error;
  }
};
