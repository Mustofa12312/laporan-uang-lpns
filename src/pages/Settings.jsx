import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Settings as SettingsIcon, Key, Tag, User, Save, Trash2, Plus, Wallet, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useStore } from "../store/useStore";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [categories, setCategories] = useState([
    { id: 1, name: "ATK", status: "ACTIVE" },
    { id: 2, name: "HONORIUM", status: "ACTIVE" },
    { id: 3, name: "TRANSPORTASI", status: "ACTIVE" },
    { id: 4, name: "PERLENGKAPAN", status: "ACTIVE" },
    { id: 5, name: "KONSUMSI", status: "ACTIVE" },
    { id: 6, name: "LAINNYA", status: "INACTIVE" },
  ]);

  const { theme, setTheme } = useTheme();
  
  const { addTransaction, closeBook, archives } = useStore();
  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeSuccess, setIncomeSuccess] = useState(false);
  
  const [periodName, setPeriodName] = useState("");
  const [closeSuccess, setCloseSuccess] = useState(false);

  const handleAddIncome = () => {
    if(!incomeTitle || !incomeAmount) return;
    
    addTransaction({
      name: incomeTitle,
      category: "DANA KAMPUS",
      date: new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}),
      amount: parseInt(incomeAmount),
      type: "income",
      branch: "Pusat",
      notes: "Injeksi dana manual dari pengaturan"
    });
    
    setIncomeTitle("");
    setIncomeAmount("");
    setIncomeSuccess(true);
    setTimeout(() => setIncomeSuccess(false), 2000);
  };

  const handleCloseBook = () => {
    if(!periodName) return;
    closeBook(periodName);
    setPeriodName("");
    setCloseSuccess(true);
    setTimeout(() => setCloseSuccess(false), 3000);
  };

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
            className="w-full justify-start font-medium"
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" /> Profil & Keamanan
          </Button>
          <Button 
            variant={activeTab === "categories" ? "secondary" : "ghost"} 
            className="w-full justify-start font-medium"
            onClick={() => setActiveTab("categories")}
          >
            <Tag className="mr-2 h-4 w-4" /> Manajemen Kategori
          </Button>
          <Button 
            variant={activeTab === "balance" ? "secondary" : "ghost"} 
            className="w-full justify-start font-medium text-green-600 dark:text-green-500"
            onClick={() => setActiveTab("balance")}
          >
            <Wallet className="mr-2 h-4 w-4" /> Manajemen Saldo
          </Button>
          <Button 
            variant={activeTab === "preferences" ? "secondary" : "ghost"} 
            className="w-full justify-start font-medium"
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
                    <Input defaultValue="Sekretaris LPNS" readOnly className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="sekretaris@lpns.org" readOnly className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Peran (Role)</label>
                    <Input defaultValue="SEKRETARIS" readOnly className="bg-secondary/50 font-bold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5"/> Ganti Password</CardTitle>
                  <CardDescription>Pastikan password baru Anda aman.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Lama</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Baru</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full sm:w-auto"><Save className="w-4 h-4 mr-2" /> Simpan Password</Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Kategori Transaksi</CardTitle>
                    <CardDescription>Tambah atau kelola kategori pengeluaran Anda.</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Tambah</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${cat.status === 'ACTIVE' ? 'bg-green-500' : 'bg-destructive'}`}></div>
                          <span className="font-medium text-sm">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Catatan: Kategori tidak dapat dihapus permanen jika terikat dengan transaksi lama, namun dapat disembunyikan.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Balance Tab */}
          {activeTab === "balance" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-sm border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-600 dark:text-green-500 flex items-center gap-2"><ArrowUpCircle className="w-5 h-5"/> Injeksi Dana (Pemasukan)</CardTitle>
                  <CardDescription>Tambahkan saldo awal atau pemasukan dana kampus/donasi ke sistem.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incomeSuccess && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm font-medium mb-4">
                      Pemasukan berhasil ditambahkan ke saldo!
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sumber Dana / Keterangan</label>
                    <Input placeholder="Misal: Pencairan Dana Kampus Tahap 2" value={incomeTitle} onChange={(e) => setIncomeTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nominal (Rp)</label>
                    <Input type="number" placeholder="1000000" min="0" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddIncome} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-white">Tambahkan ke Saldo</Button>
                </CardFooter>
              </Card>

              <Card className="border-0 shadow-sm border-destructive/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">Tutup Buku (Periode)</CardTitle>
                  <CardDescription>
                    Arsipkan transaksi saat ini dan kembalikan saldo ke 0 (Nol) untuk memulai pencatatan periode baru (Misal: Tutup Triwulan).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {closeSuccess && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium mb-4">
                      Tutup Buku berhasil! Semua transaksi telah diarsipkan dan saldo kembali menjadi 0.
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Periode Arsip</label>
                    <Input placeholder="Misal: Laporan Triwulan 1 (Jan - Mar 2026)" value={periodName} onChange={(e) => setPeriodName(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleCloseBook} variant="destructive" className="w-full sm:w-auto">Tutup Buku & Reset Data</Button>
                </CardFooter>
              </Card>

              {archives && archives.length > 0 && (
                <Card className="border-0 shadow-sm mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">Arsip Laporan</CardTitle>
                    <CardDescription>
                      Daftar periode yang telah ditutup.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {archives.map(archive => (
                      <div key={archive.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-secondary/10">
                        <div>
                          <h4 className="font-bold text-foreground">{archive.periodName}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Ditutup pada: {new Date(archive.closedAt).toLocaleDateString('id-ID')}</p>
                          <p className="text-xs font-medium text-primary mt-1">{archive.transactions.length} Transaksi Tersimpan</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
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
