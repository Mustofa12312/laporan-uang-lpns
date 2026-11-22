import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Settings as SettingsIcon, Tag, User, Trash2, Plus, Wallet, ArrowUpCircle, Check, X, Edit2, LogOut, Archive, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useStore } from "../store/useStore";
import { addCategory, updateCategory, deleteCategory } from "../services/category.service";
import { closeBook } from "../services/report.service";
import { addTransaction } from "../services/transaction.service";
import { changePassword } from "../services/auth.service";
import { updateGeneralSettings } from "../services/settings.service";
import { toast } from "react-hot-toast";
import { cn } from "../utils/utils";

// Helper for formatting number with dots
const formatNumberDots = (val) => {
  if (!val) return "";
  return new Intl.NumberFormat("id-ID").format(val);
};

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    toast.success("Berhasil keluar dari sistem");
    await logout();
    navigate("/login");
  };
  
  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(newPassword);
      toast.success("Password berhasil diperbarui!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Gagal mengganti password:", error);
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Sesi telah berakhir. Silakan logout dan login kembali untuk mengganti password.");
      } else {
        toast.error(error.message || "Gagal memperbarui password");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const { 
    archives, 
    categories,
    transactions,
    activeBranch,
    budget, setBudget
  } = useStore();

  // Balance calculations for current branch
  const branchTransactions = transactions.filter(t => t.branch === activeBranch);
  const currentIncome = branchTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const currentExpense = branchTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = currentIncome - currentExpense;

  // Income injection
  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmittingIncome, setIsSubmittingIncome] = useState(false);
  
  const handleIncomeAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setIncomeAmount(rawValue);
  };
  
  // Close book
  const [periodName, setPeriodName] = useState("");
  const [isClosingBook, setIsClosingBook] = useState(false);

  // Category management
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  // Budget
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [isSavingBudget, setIsSavingBudget] = useState(false);
  
  const handleBudgetInputChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setBudgetInput(rawValue);
  };

  const handleAddIncome = async (e) => {
    e?.preventDefault();
    if (!incomeTitle.trim()) {
      toast.error("Mohon masukkan keterangan atau sumber dana");
      return;
    }
    const parsedAmount = parseInt(incomeAmount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Mohon masukkan nominal saldo yang valid");
      return;
    }

    setIsSubmittingIncome(true);
    try {
      const selectedCategory = incomeCategory.trim() || (categories.find(c => c.status === 'ACTIVE')?.name || "BMS dan Ranting");

      await addTransaction({
        name: incomeTitle.trim(),
        category: selectedCategory,
        date: incomeDate || new Date().toISOString().split('T')[0],
        amount: parsedAmount,
        type: "income",
        branch: activeBranch || "Pusat",
        notes: "Injeksi dana manual dari pengaturan saldo",
        volume: 1,
        unit: "Paket",
        unitPrice: parsedAmount
      }, currentUser);
      
      setIncomeTitle("");
      setIncomeAmount("");
      toast.success("Saldo berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal tambah saldo:", error);
      toast.error(error.message || "Gagal menambahkan saldo");
    } finally {
      setIsSubmittingIncome(false);
    }
  };

  const handleCloseBook = async () => {
    if (!periodName.trim()) {
      toast.error("Mohon masukkan nama periode arsip");
      return;
    }

    const activeTxCount = transactions.filter(t => t.status === 'ACTIVE').length;
    if (activeTxCount === 0) {
      toast.error("Tidak ada transaksi aktif untuk ditutup.");
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin melakukan Tutup Buku untuk "${periodName}"?\n\nSemua transaksi aktif saat ini (${activeTxCount} transaksi) akan diarsipkan dan saldo berjalan akan di-reset untuk periode baru.`
    );
    if (!confirmed) return;

    setIsClosingBook(true);
    try {
      await closeBook(periodName.trim(), currentUser);
      setPeriodName("");
      toast.success("Tutup Buku berhasil! Semua transaksi diarsipkan.");
    } catch (error) {
      console.error("Gagal tutup buku:", error);
      toast.error(error.message || "Gagal tutup buku");
    } finally {
      setIsClosingBook(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await addCategory({ name: newCategoryName.trim().toUpperCase(), status: "ACTIVE" });
      setNewCategoryName("");
      toast.success("Kategori berhasil ditambahkan");
    } catch (error) {
      console.error("Gagal menambah kategori:", error);
      toast.error("Gagal menambah kategori");
    }
  };

  const handleSaveCategory = async (id) => {
    if (!editingCategoryName.trim()) return;
    try {
      await updateCategory(id, { name: editingCategoryName.trim().toUpperCase() });
      setEditingCategoryId(null);
      setEditingCategoryName("");
      toast.success("Kategori berhasil diperbarui");
    } catch (error) {
      console.error("Gagal update kategori:", error);
      toast.error("Gagal update kategori");
    }
  };

  const handleToggleCategoryStatus = async (id, currentStatus) => {
    try {
      await updateCategory(id, { status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      toast.success(currentStatus === "ACTIVE" ? "Kategori dinonaktifkan" : "Kategori diaktifkan");
    } catch (error) {
      console.error("Gagal toggle kategori:", error);
      toast.error("Gagal mengubah status kategori");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success(`Kategori "${name}" berhasil dihapus`);
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      toast.error("Gagal menghapus kategori");
    }
  };

  const handleSaveBudget = async () => {
    const parsedBudget = parseInt(budgetInput) || 0;
    if (parsedBudget < 0) {
      toast.error("Target anggaran tidak boleh negatif");
      return;
    }
    setIsSavingBudget(true);
    try {
      await updateGeneralSettings({ budget: parsedBudget });
      setBudget(parsedBudget);
      setEditBudget(false);
      toast.success("Target anggaran berhasil diperbarui");
    } catch (error) {
      console.error("Gagal update budget:", error);
      toast.error("Gagal update target anggaran");
    } finally {
      setIsSavingBudget(false);
    }
  };

  const formatRupiah = (amount) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground mt-1">Kelola preferensi dan sistem aplikasi</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <Button 
            variant={activeTab === "profile" ? "secondary" : "ghost"} 
            className={cn("w-full justify-start font-medium", activeTab === "profile" && "bg-secondary font-semibold")}
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" /> Profil
          </Button>
          <Button 
            variant={activeTab === "categories" ? "secondary" : "ghost"} 
            className={cn("w-full justify-start font-medium", activeTab === "categories" && "bg-secondary font-semibold")}
            onClick={() => setActiveTab("categories")}
          >
            <Tag className="mr-2 h-4 w-4" /> Manajemen Kategori
          </Button>
          <Button 
            variant={activeTab === "balance" ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start font-medium",
              activeTab === "balance" 
                ? "bg-secondary text-green-600 dark:text-green-400 font-bold" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("balance")}
          >
            <Wallet className="mr-2 h-4 w-4" /> Manajemen Saldo
          </Button>
          <Button 
            variant={activeTab === "preferences" ? "secondary" : "ghost"} 
            className={cn("w-full justify-start font-medium", activeTab === "preferences" && "bg-secondary font-semibold")}
            onClick={() => setActiveTab("preferences")}
          >
            <SettingsIcon className="mr-2 h-4 w-4" /> Preferensi & Tema
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Profil Saya</CardTitle>
                  <CardDescription>Informasi akun pengguna Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input defaultValue={currentUser?.name || "—"} readOnly className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue={currentUser?.email || "—"} readOnly className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Peran (Role)</label>
                    <Input defaultValue={currentUser?.role || "—"} readOnly className="bg-secondary/50 font-bold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Keamanan</CardTitle>
                  <CardDescription>Ubah kata sandi akun Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Baru</label>
                    <Input 
                      type="password" 
                      placeholder="Minimal 6 karakter" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                    <Input 
                      type="password" 
                      placeholder="Ulangi password baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !newPassword || !confirmPassword}
                  >
                    {isChangingPassword ? "Menyimpan..." : "Perbarui Password"}
                  </Button>
                </CardContent>
              </Card>

              {/* Logout (Mobile Friendly) */}
              <Card className="border-0 shadow-sm border-destructive/20 mt-6 md:hidden">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2"><LogOut className="w-5 h-5"/> Keluar Aplikasi</CardTitle>
                  <CardDescription>Akhiri sesi Anda dan keluar dari sistem.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={handleLogout} variant="destructive" className="w-full text-white font-medium">
                    Keluar dari Sistem
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Categories Tab — Now using global store */}
          {activeTab === "categories" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Kategori Transaksi</CardTitle>
                    <CardDescription>Tambah atau kelola kategori pengeluaran Anda.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Add new category */}
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Nama kategori baru..." 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                      <Plus className="w-4 h-4 mr-2"/>Tambah
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-2 h-2 rounded-full ${cat.status === 'ACTIVE' ? 'bg-green-500' : 'bg-destructive'}`}></div>
                          {editingCategoryId === cat.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input 
                                className="h-8 text-sm"
                                value={editingCategoryName} 
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory(cat.id)}
                                autoFocus
                              />
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={() => handleSaveCategory(cat.id)}>
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditingCategoryId(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="font-medium text-sm">{cat.name}</span>
                          )}
                          {cat.status === 'INACTIVE' && (
                            <span className="text-[10px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded font-bold">NONAKTIF</span>
                          )}
                        </div>
                        {editingCategoryId !== cat.id && (
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" size="sm" className="text-xs h-8"
                              onClick={() => { setEditingCategoryId(cat.id); setEditingCategoryName(cat.name); }}
                            >
                              <Edit2 className="w-3 h-3 mr-1" />Edit
                            </Button>
                            <Button 
                              variant="ghost" size="sm" className="text-xs h-8"
                              onClick={() => handleToggleCategoryStatus(cat.id, cat.status)}
                            >
                              {cat.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                            </Button>
                            <Button 
                              variant="ghost" size="sm" 
                              className="text-xs text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                              onClick={() => deleteCategory(cat.id)}
                            >
                              <Trash2 className="w-4 h-4"/>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Catatan: Kategori yang dinonaktifkan tidak akan muncul saat mencatat transaksi baru.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Balance Tab */}
          {activeTab === "balance" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              
              {/* Ringkasan Saldo Kas Saat Ini */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 via-background to-secondary/30 border border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                      <Wallet className="w-5 h-5 text-primary" />
                      Ringkasan Saldo Kas Berjalan
                    </CardTitle>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                      Cabang: {activeBranch || "Pusat"}
                    </span>
                  </div>
                  <CardDescription>
                    Akumulasi pemasukan, pengeluaran, dan saldo kas aktif saat ini.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-background/80 backdrop-blur rounded-lg border shadow-sm">
                      <p className="text-xs text-muted-foreground font-medium">Saldo Kas Berjalan</p>
                      <p className={cn("text-2xl font-black mt-1", currentBalance >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive")}>
                        {formatRupiah(currentBalance)}
                      </p>
                    </div>
                    <div className="p-3.5 bg-background/80 backdrop-blur rounded-lg border shadow-sm">
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-600" /> Total Pemasukan
                      </p>
                      <p className="text-xl font-bold mt-1 text-green-600 dark:text-green-500">
                        {formatRupiah(currentIncome)}
                      </p>
                    </div>
                    <div className="p-3.5 bg-background/80 backdrop-blur rounded-lg border shadow-sm">
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-destructive rotate-180" /> Total Pengeluaran
                      </p>
                      <p className="text-xl font-bold mt-1 text-destructive">
                        {formatRupiah(currentExpense)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Setting */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">💰 Target Anggaran Pengeluaran</CardTitle>
                  <CardDescription>Atur target anggaran pengeluaran untuk monitoring dan persentase di Dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                  {editBudget ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input 
                        type="text" 
                        value={formatNumberDots(budgetInput)} 
                        onChange={handleBudgetInputChange} 
                        placeholder="Contoh: 20.000.000"
                        className="sm:max-w-xs"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveBudget} disabled={isSavingBudget}>
                          {isSavingBudget ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Button 
                          variant="outline" 
                          disabled={isSavingBudget}
                          onClick={() => { setEditBudget(false); setBudgetInput(budget ? budget.toString() : "20000000"); }}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">{formatRupiah(budget)}</span>
                      <Button variant="outline" size="sm" onClick={() => { setBudgetInput(budget ? budget.toString() : "20000000"); setEditBudget(true); }}>
                        Ubah Target
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Injeksi Dana / Pemasukan Saldo */}
              <Card className="border-0 shadow-sm border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-600 dark:text-green-500 flex items-center gap-2">
                    <ArrowUpCircle className="w-5 h-5"/> Injeksi Dana (Pemasukan Saldo)
                  </CardTitle>
                  <CardDescription>
                    Tambahkan saldo awal atau pemasukan dana kas ke cabang {activeBranch || "Pusat"}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Keterangan / Sumber Dana *</label>
                      <Input 
                        placeholder="Misal: Saldo Awal / Pencairan Dana BMS" 
                        value={incomeTitle} 
                        onChange={(e) => setIncomeTitle(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kategori Pemasukan</label>
                      <Select 
                        value={incomeCategory} 
                        onChange={(e) => setIncomeCategory(e.target.value)}
                      >
                        <option value="">-- Kategori (Default: BMS dan Ranting) --</option>
                        {categories.filter(c => c.status === 'ACTIVE').map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nominal Saldo (Rp) *</label>
                      <Input 
                        type="text" 
                        placeholder="1.000.000" 
                        value={formatNumberDots(incomeAmount)} 
                        onChange={handleIncomeAmountChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tanggal Transaksi</label>
                      <Input 
                        type="date" 
                        value={incomeDate} 
                        onChange={(e) => setIncomeDate(e.target.value)} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAddIncome} 
                    disabled={isSubmittingIncome}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-white"
                  >
                    {isSubmittingIncome ? "Menyimpan..." : "Tambahkan ke Saldo"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Tutup Buku */}
              <Card className="border-0 shadow-sm border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <Archive className="w-5 h-5"/> Tutup Buku (Periode)
                  </CardTitle>
                  <CardDescription>
                    Arsipkan transaksi saat ini dan kembalikan saldo berjalan ke 0 (Nol) untuk memulai pencatatan periode baru (Misal: Tutup Triwulan).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 inline shrink-0" /> Perhatian:
                    </p>
                    <p>
                      Tutup Buku akan mengarsipkan seluruh transaksi aktif saat ini. Transaksi yang diarsipkan tetap tersimpan di riwayat arsip tetapi tidak lagi mempengaruhi saldo kas berjalan yang baru.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Periode Arsip *</label>
                    <Input 
                      placeholder="Misal: Laporan Triwulan 1 (Jan - Mar 2026)" 
                      value={periodName} 
                      onChange={(e) => setPeriodName(e.target.value)} 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCloseBook} 
                    variant="destructive" 
                    disabled={isClosingBook}
                    className="w-full sm:w-auto"
                  >
                    {isClosingBook ? "Memproses Tutup Buku..." : "Tutup Buku & Reset Data"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Arsip Laporan */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="w-5 h-5 text-primary" /> Arsip Laporan Periode
                  </CardTitle>
                  <CardDescription>
                    Daftar periode pembukuan yang telah ditutup.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {archives && archives.length > 0 ? (
                    archives.map(archive => (
                      <div key={archive.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-secondary/10 gap-3">
                        <div>
                          <h4 className="font-bold text-foreground text-base">{archive.periodName}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ditutup pada: {archive.closedAt ? new Date(archive.closedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"} {archive.closedByName ? `oleh ${archive.closedByName}` : ""}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                            <span className="font-medium text-primary">
                              {(archive.transactionCount ?? archive.transactions?.length ?? 0)} Transaksi Tersimpan
                            </span>
                            {archive.totalIncome !== undefined && (
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                Masuk: {formatRupiah(archive.totalIncome)}
                              </span>
                            )}
                            {archive.totalExpense !== undefined && (
                              <span className="text-destructive font-medium">
                                Keluar: {formatRupiah(archive.totalExpense)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-lg">
                      Belum ada riwayat periode tutup buku.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Preferensi Tampilan</CardTitle>
                  <CardDescription>Sesuaikan tema aplikasi LPNS.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Tema Gelap (Dark Mode)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant={theme === 'light' ? 'default' : 'outline'} className="h-20 flex flex-col gap-2 transition-all" onClick={() => setTheme('light')}>
                        <div className="w-4 h-4 rounded-full border-2 border-muted bg-white"></div>
                        Terang
                      </Button>
                      <Button variant={theme === 'dark' ? 'default' : 'outline'} className="h-20 flex flex-col gap-2 bg-slate-950 text-white hover:bg-slate-900 hover:text-white transition-all" onClick={() => setTheme('dark')}>
                        <div className="w-4 h-4 rounded-full border-2 border-muted bg-slate-900"></div>
                        Gelap
                      </Button>
                      <Button variant={theme === 'system' ? 'default' : 'outline'} className="h-20 flex flex-col gap-2 transition-all" onClick={() => setTheme('system')}>
                        <div className="w-4 h-4 rounded-full border-2 border-muted bg-gradient-to-r from-white to-slate-900"></div>
                        Sistem
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
