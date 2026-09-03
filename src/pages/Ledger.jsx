import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { BookOpen, Search, Download, Printer } from "lucide-react";
import { Input } from "../components/ui/input";
import { cn } from "../utils/utils";
import ContextMenu from "../components/ContextMenu";
import { useStore } from "../store/useStore";

export default function Ledger() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    selectedItem: null
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const initialBalance = 0;
  const { transactions, activeBranch, deleteTransaction } = useStore();

  // Filter transactions by branch
  const branchTransactions = transactions.filter(t => t.branch === activeBranch);
  
  // Sort from oldest to newest for ledger calculation
  const sortedTransactions = [...branchTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Map to ledger entries format
  const ledgerEntries = [
    { id: "LG-001", date: "-", desc: "Saldo Awal", ref: "-", debit: 0, credit: 0, isBalance: true },
    ...sortedTransactions.map(t => ({
      id: t.id,
      date: t.date,
      desc: t.name,
      ref: t.type === 'income' ? 'INC' : 'EXP',
      debit: t.type === 'income' ? t.amount : 0,
      credit: t.type === 'expense' ? t.amount : 0,
      isBalance: false
    }))
  ];

  let currentBalance = initialBalance;
  
  const calculatedLedger = ledgerEntries.map(entry => {
    if (entry.isBalance) {
      return { ...entry, balance: currentBalance };
    }
    currentBalance = currentBalance + entry.debit - entry.credit;
    return { ...entry, balance: currentBalance };
  });

  const runningLedger = calculatedLedger.filter(e => e.desc.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExportCSV = () => {
    const headers = ["Tanggal", "Referensi", "Uraian", "Debit", "Kredit", "Saldo"];
    const csvContent = [
      headers.join(","),
      ...runningLedger.map(e => [
        `"${e.date}"`,
        `"${e.ref}"`,
        `"${e.desc}"`,
        e.debit,
        e.credit,
        e.balance
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Buku_Besar_LPNS_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Buku Besar <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold border border-primary/20">AKUNTANSI</span>
          </h1>
          <p className="text-muted-foreground mt-1">Laporan jurnal umum dan saldo berjalan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" className="shadow-sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Cetak Jurnal
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/30">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Bulan</label>
              <Select defaultValue="09">
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
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tahun</label>
              <Select defaultValue="2026">
                <option value="2026">2026</option>
              </Select>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari uraian..." 
              className="pl-9 bg-background" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Ref</th>
                <th className="px-4 py-3 font-medium">Uraian Keterangan</th>
                <th className="px-4 py-3 font-medium text-right">Debit (Masuk)</th>
                <th className="px-4 py-3 font-medium text-right">Kredit (Keluar)</th>
                <th className="px-4 py-3 font-medium text-right bg-primary/5">Saldo (Balance)</th>
              </tr>
            </thead>
            <tbody>
              {runningLedger.length > 0 ? (
                runningLedger.map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    className={cn(
                      "border-b transition-colors cursor-context-menu hover:bg-secondary/20",
                      entry.isBalance ? "bg-secondary/10" : ""
                    )}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if(!entry.isBalance) {
                        setContextMenu({
                          isOpen: true,
                          position: { x: e.clientX, y: e.clientY },
                          selectedItem: { id: entry.id, description: entry.desc }
                        });
                      }
                    }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{entry.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.ref}</td>
                  <td className="px-4 py-3 min-w-[250px]">{entry.desc}</td>
                  <td className="px-4 py-3 text-right text-green-600">
                    {entry.debit > 0 ? formatRupiah(entry.debit) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-destructive">
                    {entry.credit > 0 ? formatRupiah(entry.credit) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold bg-primary/5">
                    {formatRupiah(entry.balance)}
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">Tidak ada jurnal untuk periode ini.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-secondary/50 border-t font-semibold">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right">TOTAL PERGERAKAN:</td>
                <td className="px-4 py-3 text-right text-green-600">{formatRupiah(calculatedLedger.reduce((sum, e) => sum + e.debit, 0))}</td>
                <td className="px-4 py-3 text-right text-destructive">{formatRupiah(calculatedLedger.reduce((sum, e) => sum + e.credit, 0))}</td>
                <td className="px-4 py-3 text-right bg-primary/10 text-primary">{formatRupiah(currentBalance)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <ContextMenu 
        position={contextMenu.position}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        selectedItem={contextMenu.selectedItem}
        onEdit={() => alert("Fitur edit akan segera hadir untuk " + contextMenu.selectedItem?.description)}
        onDuplicate={() => alert("Fitur duplikat akan segera hadir.")}
        onDelete={() => deleteTransaction(contextMenu.selectedItem?.id)}
        onPrint={() => window.print()}
      />
    </div>
  );
}
