import { create } from 'zustand';

export const useStore = create((set) => ({
  // =============================================
  // TRANSACTIONS
  // =============================================
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),

  // =============================================
  // ARCHIVES
  // =============================================
  archives: [],
  setArchives: (archives) => set({ archives }),

  // =============================================
  // CATEGORIES
  // =============================================
  categories: [],
  setCategories: (categories) => set({ categories }),

  // =============================================
  // USERS
  // =============================================
  users: [],
  setUsers: (users) => set({ users }),

  // =============================================
  // BUDGET (configurable)
  // =============================================
  budget: 20000000,
  setBudget: (amount) => set({ budget: amount }),

  // =============================================
  // BRANCHES
  // =============================================
  activeBranch: "Pusat",
  setActiveBranch: (branch) => set({ activeBranch: branch }),

}));

