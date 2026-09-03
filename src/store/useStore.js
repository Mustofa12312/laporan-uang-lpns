import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialTransactions = [
  { id: "TX-1001", name: "Dana Kampus Tahap 1", category: "DANA KAMPUS", date: "2026-09-01", amount: 10000000, type: "income", branch: "Pusat", notes: "", volume: 1, unit: "Paket", unitPrice: 10000000 },
  { id: "TX-1002", name: "Beli ATK Kertas A4", category: "ATK", date: "2026-09-03", amount: 150000, type: "expense", branch: "Pusat", notes: "", volume: 5, unit: "Rim", unitPrice: 30000 },
  { id: "TX-1003", name: "Honor Kegiatan", category: "HONORIUM", date: "2026-09-04", amount: 500000, type: "expense", branch: "Pusat", notes: "", volume: 1, unit: "Orang", unitPrice: 500000 },
  { id: "TX-1004", name: "Uang Kas Pengurus", category: "KAS", date: "2026-09-05", amount: 200000, type: "income", branch: "Pusat", notes: "", volume: 1, unit: "Kali", unitPrice: 200000 },
  { id: "TX-1005", name: "Konsumsi Rapat", category: "KONSUMSI", date: "2026-08-15", amount: 300000, type: "expense", branch: "Pusat", notes: "Rapat bulanan", volume: 20, unit: "Porsi", unitPrice: 15000 },
  { id: "TX-1006", name: "Dana Kampus Tahap Awal", category: "DANA KAMPUS", date: "2026-08-01", amount: 15000000, type: "income", branch: "Pusat", notes: "", volume: 1, unit: "Paket", unitPrice: 15000000 },
  { id: "TX-1007", name: "Sewa Transportasi", category: "TRANSPORTASI", date: "2026-08-20", amount: 250000, type: "expense", branch: "Pusat", notes: "", volume: 1, unit: "Kali", unitPrice: 250000 },
  { id: "TX-1008", name: "Beli Perlengkapan", category: "PERLENGKAPAN", date: "2026-07-10", amount: 400000, type: "expense", branch: "Pusat", notes: "", volume: 2, unit: "Set", unitPrice: 200000 },
  { id: "TX-1009", name: "Dana Kampus Juli", category: "DANA KAMPUS", date: "2026-07-01", amount: 12000000, type: "income", branch: "Pusat", notes: "", volume: 1, unit: "Paket", unitPrice: 12000000 },
  { id: "TX-1010", name: "Honor Narasumber", category: "HONORIUM", date: "2026-07-15", amount: 750000, type: "expense", branch: "Pusat", notes: "", volume: 3, unit: "Orang", unitPrice: 250000 },
];

const initialCategories = [
  { id: 1, name: "ATK", status: "ACTIVE" },
  { id: 2, name: "HONORIUM", status: "ACTIVE" },
  { id: 3, name: "TRANSPORTASI", status: "ACTIVE" },
  { id: 4, name: "PERLENGKAPAN", status: "ACTIVE" },
  { id: 5, name: "KONSUMSI", status: "ACTIVE" },
  { id: 6, name: "DANA KAMPUS", status: "ACTIVE" },
  { id: 7, name: "KAS", status: "ACTIVE" },
];

const initialUsers = [
  { id: 1, name: "Admin Utama", email: "admin@lpns.org", password: "admin123", role: "ADMIN", status: "ACTIVE", lastLogin: "03 Sep 2026, 09:00" },
  { id: 2, name: "Ketua LPNS", email: "ketua@lpns.org", password: "ketua123", role: "KETUA", status: "ACTIVE", lastLogin: "01 Sep 2026, 14:30" },
  { id: 3, name: "Sekretaris", email: "sekretaris@lpns.org", password: "sekre123", role: "SEKRETARIS", status: "ACTIVE", lastLogin: "02 Sep 2026, 10:15" },
  { id: 4, name: "Bendahara", email: "bendahara@lpns.org", password: "benda123", role: "BENDAHARA", status: "ACTIVE", lastLogin: "03 Sep 2026, 11:20" },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // =============================================
      // TRANSACTIONS
      // =============================================
      transactions: initialTransactions,
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: `TX-${Date.now()}` }, ...state.transactions]
      })),
      
      updateTransaction: (id, updatedData) => set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...updatedData } : t
        )
      })),

      duplicateTransaction: (id) => set((state) => {
        const original = state.transactions.find(t => t.id === id);
        if (!original) return state;
        const duplicate = { 
          ...original, 
          id: `TX-${Date.now()}`,
          name: `${original.name} (Salinan)`,
          date: new Date().toISOString().split('T')[0]
        };
        return { transactions: [duplicate, ...state.transactions] };
      }),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      // =============================================
      // ARCHIVES
      // =============================================
      archives: [],
      closeBook: (periodName) => set((state) => {
        if (state.transactions.length === 0) return state;
        const newArchive = {
          id: `ARCHIVE-${Date.now()}`,
          periodName,
          closedAt: new Date().toISOString(),
          transactions: [...state.transactions]
        };
        return {
          archives: [newArchive, ...state.archives],
          transactions: []
        };
      }),

      // =============================================
      // CATEGORIES
      // =============================================
      categories: initialCategories,

      addCategory: (name) => set((state) => ({
        categories: [...state.categories, { 
          id: Date.now(), 
          name: name.toUpperCase(), 
          status: "ACTIVE" 
        }]
      })),

      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),

      // =============================================
      // USERS
      // =============================================
      users: initialUsers,

      addUser: (user) => set((state) => ({
        users: [...state.users, { ...user, id: Date.now() }]
      })),

      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => 
          u.id === id ? { ...u, ...updates } : u
        )
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),

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

      // =============================================
      // AUTH (local)
      // =============================================
      currentUser: null,
      
      loginUser: (email, password) => {
        const users = get().users;
        const user = users.find(u => u.email === email && u.password === password && u.status === "ACTIVE");
        if (user) {
          const now = new Date();
          const formatted = `${String(now.getDate()).padStart(2,'0')} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"][now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
          set((state) => ({
            currentUser: { id: user.id, name: user.name, email: user.email, role: user.role },
            users: state.users.map(u => u.id === user.id ? { ...u, lastLogin: formatted } : u)
          }));
          return { success: true, user };
        }
        return { success: false, error: "Email atau password salah, atau akun tidak aktif." };
      },

      logoutUser: () => set({ currentUser: null }),
    }),
    {
      name: 'lpns-storage',
    }
  )
);
