import { useState } from "react";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { FileDown, Printer, FileText, Download, Lock, LockOpen, CheckCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { exportToExcel, exportToPDF } from "../services/export.service";
import { cn } from "../utils/utils";

export default function Reports() {
  const [isLocked, setIsLocked] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const categoryRecap = [
    { name: "HONORIUM", amount: 4000000, transactions: 8 },
    { name: "PERLENGKAPAN", amount: 2100000, transactions: 5 },
    { name: "ATK", amount: 1500000, transactions: 12 },
    { name: "TRANSPORTASI", amount: 1250000, transactions: 15 },
    { name: "KONSUMSI", amount: 900000, transactions: 7 },
  ];

  // Dummy detailed transactions for export demonstration
  const dummyTransactions = [
    { id: "TX-001", date: "03 Sep 2026", name: "Beli Kertas A4", category: "ATK", amount: 150000, description: "Untuk printer sekretariat" },
    { id: "TX-002", date: "04 Sep 2026", name: "Honor Rapat", category: "HONORIUM", amount: 500000, description: "Honor peserta" },
    { id: "TX-003", date: "05 Sep 2026", name: "Snack Rapat", category: "KONSUMSI", amount: 250000, description: "" },
    { id: "TX-004", date: "06 Sep 2026", name: "Bensin Survei", category: "TRANSPORTASI", amount: 100000, description: "Survei lapangan" },
    { id: "TX-005", date: "08 Sep 2026", name: "Sewa Proyektor", category: "PERLENGKAPAN", amount: 300000, description: "Acara sosialisasi" },
    { id: "TX-006", date: "10 Sep 2026", name: "Tinta Printer", category: "ATK", amount: 85000, description: "" },
  ];

  const total = categoryRecap.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTx = categoryRecap.reduce((acc, curr) => acc + curr.transactions, 0);

  const handleExportExcel = () => {
    exportToExcel(dummyTransactions, "September 2026");
  };

  const handleExportPDF = () => {
    exportToPDF(dummyTransactions, "September 2026", isApproved);
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
              <Select defaultValue="09">
                <option value="09">September</option>
                <option value="08">Agustus</option>
                <option value="07">Juli</option>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tahun</label>
              <Select defaultValue="2026">
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
              <p className="text-sm text-muted-foreground">Periode: September 2026</p>
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
