import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialTransactions = [
  { id: "TX-1001", name: "Dana Kampus Tahap 1", category: "DANA KAMPUS", date: "2026-09-01", amount: 10000000, type: "income", branch: "Pusat" },
  { id: "TX-1002", name: "Beli ATK Kertas A4", category: "ATK", date: "2026-09-03", amount: 150000, type: "expense", branch: "Pusat" },
  { id: "TX-1003", name: "Honor Kegiatan", category: "HONORIUM", date: "2026-09-04", amount: 500000, type: "expense", branch: "Pusat" },
  { id: "TX-1004", name: "Uang Kas Pengurus", category: "KAS", date: "2026-09-05", amount: 200000, type: "income", branch: "Pusat" },
];

export const useStore = create(
  persist(
    (set) => ({
      // Transactions State
      transactions: initialTransactions,
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: `TX-${Date.now()}` }, ...state.transactions]
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      // Categories State
      categories: [
        { id: 1, name: "ATK", status: "ACTIVE" },
        { id: 2, name: "HONORIUM", status: "ACTIVE" },
        { id: 3, name: "TRANSPORTASI", status: "ACTIVE" },
        { id: 4, name: "PERLENGKAPAN", status: "ACTIVE" },
        { id: 5, name: "KONSUMSI", status: "ACTIVE" },
        { id: 6, name: "DANA KAMPUS", status: "ACTIVE" },
        { id: 7, name: "KAS", status: "ACTIVE" }
      ],

      // Branches State
      activeBranch: "Pusat",
      setActiveBranch: (branch) => set({ activeBranch: branch })
    }),
    {
      name: 'lpns-storage', // name of item in local storage
    }
  )
);
