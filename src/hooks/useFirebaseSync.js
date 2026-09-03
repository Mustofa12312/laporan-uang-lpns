import { useEffect } from 'react';
import { db } from '../lib/firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';

export const useFirebaseSync = () => {
  const setTransactions = useStore((s) => s.setTransactions);
  const setCategories = useStore((s) => s.setCategories);
  const setUsers = useStore((s) => s.setUsers);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Listen to users
    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    // Listen to categories
    const categoriesUnsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
    });

    // Listen to transactions
    const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const txUnsub = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txData);
    }, (error) => {
      console.error("Error listening to transactions: ", error);
      // Fallback if index is not ready
      if (error.code === 'failed-precondition') {
         const noIdxQ = query(collection(db, 'transactions'));
         onSnapshot(noIdxQ, (snap) => {
             const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             setTransactions(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
         });
      }
    });

    return () => {
      usersUnsub();
      categoriesUnsub();
      txUnsub();
    };
  }, [isAuthenticated, setTransactions, setCategories, setUsers]);
};
