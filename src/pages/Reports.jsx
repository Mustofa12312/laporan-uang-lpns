import { useState } from "react";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { FileDown, Printer, FileText, Download, Lock, LockOpen, CheckCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { exportToExcel, exportToPDF } from "../services/export.service";
import { cn } from "../utils/utils";
import { useStore } from "../store/useStore";

export default function Reports() {
  const [isLocked, setIsLocked] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  const { transactions, activeBranch } = useStore();

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const getMonthFromDate = (dateStr) => {
    const d = new Date(dateStr);
    if(isNaN(d.getTime())) return "all";
    return String(d.getMonth() + 1).padStart(2, '0');
  };
  
  const getYearFromDate = (dateStr) => {
    const d = new Date(dateStr);
    if(isNaN(d.getTime())) return new Date().getFullYear().toString();
    return d.getFullYear().toString();
  };

  const formatDateForDisplay = (dateStr) => {
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    if (isNaN(d.getTime())) return dateStr;
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const branchExpenses = transactions.filter(t => {
    const isExpense = t.type === 'expense';
    const isBranch = t.branch === activeBranch;
    const isMonth = filterMonth === "all" || getMonthFromDate(t.date) === filterMonth;
    const isYear = filterYear === "all" || getYearFromDate(t.date) === filterYear;
    return isExpense && isBranch && isMonth && isYear;
  });

  const categoryMap = {};
  branchExpenses.forEach(t => {
    if(!categoryMap[t.category]) {
      categoryMap[t.category] = { name: t.category, amount: 0, transactions: 0 };
    }
    categoryMap[t.category].amount += t.amount;
    categoryMap[t.category].transactions += 1;
  });
  
  const categoryRecap = Object.values(categoryMap).sort((a,b) => b.amount - a.amount);
  
  const total = categoryRecap.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTx = categoryRecap.reduce((acc, curr) => acc + curr.transactions, 0);

  const mappedTransactions = branchExpenses.map(t => ({
    ...t,
    date: formatDateForDisplay(t.date)
  }));

  const periodName = `${filterMonth === "all" ? "Semua Bulan" : filterMonth} ${filterYear}`;

  const handleExportExcel = () => {
    exportToExcel(mappedTransactions, periodName);
  };

  const handleExportPDF = () => {
    exportToPDF(mappedTransactions, periodName, isApproved);
  };

  const handleToggleLock = () => {
    if (isLocked) {
      setIsLocked(false);
      setIsApproved(false);
    } else {
      setIsLocked(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Laporan
            {isApproved && <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200 dark:border-green-800"><ShieldCheck className="w-4 h-4"/> DISETUJUI</span>}
            {!isApproved && isLocked && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-800"><Lock className="w-4 h-4"/> TERKUNCI</span>}
          </h1>
          <p className="text-muted-foreground mt-1">Laporan pengeluaran keuangan LPNS</p>
        </div>
        
        {/* Verification Controls (Admin/Ketua) */}
        <div className="flex gap-2">
          {isLocked && !isApproved && (
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20" onClick={() => setIsApproved(true)}>
              <CheckCircle className="mr-2 h-4 w-4" /> Setujui Laporan
            </Button>
          )}
          <Button 
            variant={isLocked ? "destructive" : "default"} 
            className={cn("shadow-md transition-colors", !isLocked && "bg-amber-600 hover:bg-amber-700 text-white")}
            onClick={handleToggleLock}
          >
            {isLocked ? <LockOpen className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
            {isLocked ? "Buka Kunci Data" : "Tutup Pembukuan"}
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-4 w-full">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Bulan</label>
              <Select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                <option value="all">Semua Bulan</option>
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tahun</label>
              <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="all">Semua Tahun</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </Select>
            </div>
          </div>
          <Button className="w-full sm:w-auto mt-5 sm:mt-0 shadow-md">Tampilkan</Button>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-primary/5 p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Laporan Pengeluaran</h2>
              <p className="text-sm text-muted-foreground">Periode: {periodName}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              <Button variant="outline" size="sm" className="shrink-0 bg-background" onClick={handleExportExcel}>
                <FileDown className="mr-2 h-4 w-4 text-green-600" /> Excel
              </Button>
              <Button variant="outline" size="sm" className="shrink-0 bg-background" onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4 text-red-500" /> PDF
              </Button>
              <Button variant="outline" size="sm" className="shrink-0 bg-background hidden sm:flex" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </div>
          <CardContent className="p-0">
            {/* KPI Recap */}
            <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 border-b bg-secondary/20">
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-foreground">{formatRupiah(total)}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">Jumlah Transaksi</p>
                <p className="text-2xl font-bold text-foreground">{totalTx}</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/40">
                  <tr>
                    <th className="px-6 py-4 font-medium">Kategori</th>
                    <th className="px-6 py-4 font-medium text-center">Transaksi</th>
                    <th className="px-6 py-4 font-medium text-right">Total Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categoryRecap.map((item, i) => (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                      <td className="px-6 py-4 text-center">{item.transactions}</td>
                      <td className="px-6 py-4 text-right font-semibold">{formatRupiah(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5 font-bold">
                    <td className="px-6 py-4 text-primary">TOTAL</td>
                    <td className="px-6 py-4 text-center text-primary">{totalTx}</td>
                    <td className="px-6 py-4 text-right text-primary">{formatRupiah(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
