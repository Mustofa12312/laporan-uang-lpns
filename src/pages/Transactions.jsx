import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Search, Filter, Plus, FileText, ArrowDownIcon, ArrowUpIcon, FileDown, X, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/utils";
import ContextMenu from "../components/ContextMenu";
import EditTransactionModal from "../components/EditTransactionModal";
import { useStore } from "../store/useStore";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    selectedItem: null
  });

  // Edit Modal State
  const [editModal, setEditModal] = useState({ isOpen: false, transaction: null });

  const { transactions, activeBranch, deleteTransaction, duplicateTransaction, categories } = useStore();

  // Filter States (advanced)
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMinAmount, setFilterMinAmount] = useState("");

  // Applied filters (only applied when user clicks "Terapkan")
  const [appliedFilters, setAppliedFilters] = useState({
    month: "all",
    type: "all",
    category: "all",
    minAmount: ""
  });

  const getMonthFromDate = (dateStr) => {
    const d = new Date(dateStr);
    if(isNaN(d.getTime())) return "all";
    return String(d.getMonth() + 1).padStart(2, '0');
  };

  const formatDateForDisplay = (dateStr) => {
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    if (isNaN(d.getTime())) return dateStr;
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = t.branch === activeBranch;
    const matchesMonth = appliedFilters.month === "all" || getMonthFromDate(t.date) === appliedFilters.month;
    const matchesType = appliedFilters.type === "all" || t.type === appliedFilters.type;
    const matchesCategory = appliedFilters.category === "all" || t.category === appliedFilters.category;
    const matchesMinAmount = !appliedFilters.minAmount || t.amount >= parseInt(appliedFilters.minAmount);
    return matchesSearch && matchesBranch && matchesMonth && matchesType && matchesCategory && matchesMinAmount;
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      month: filterMonth,
      type: filterType,
      category: filterCategory,
      minAmount: filterMinAmount
    });
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilterMonth("all");
    setFilterType("all");
    setFilterCategory("all");
    setFilterMinAmount("");
    setAppliedFilters({ month: "all", type: "all", category: "all", minAmount: "" });
  };

  const hasActiveFilters = appliedFilters.month !== "all" || appliedFilters.type !== "all" || appliedFilters.category !== "all" || appliedFilters.minAmount;

  const handleExportCSV = () => {
    const headers = ["ID Transaksi", "Tanggal", "Tipe", "Kategori", "Uraian", "Nominal", "Cabang"];
    const csvContent = [
      headers.join(","),
      ...filtered.map(t => [
        `"${t.id}"`,
        `"${formatDateForDisplay(t.date)}"`,
        `"${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}"`,
        `"${t.category}"`,
        `"${t.volume ? `${t.name} (${t.volume} ${t.unit} x ${formatRupiah(t.unitPrice)})` : t.name}"`,
        t.amount,
        `"${t.branch}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Transaksi_LPNS_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEdit = (transactionId) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (tx) {
      setEditModal({ isOpen: true, transaction: tx });
    }
  };

  const handleDuplicate = (transactionId) => {
    duplicateTransaction(transactionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transaksi</h1>
          <p className="text-muted-foreground mt-1">Kelola pencatatan arus kas (Pemasukan & Pengeluaran)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex shadow-sm" onClick={handleExportCSV}>
            <FileDown className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Link to="/transactions/new">
              <Plus className="mr-2 h-4 w-4" /> Catat 
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari transaksi..." 
            className="pl-9 bg-background shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select className="w-[140px] shadow-sm hidden sm:flex" value={appliedFilters.month} onChange={(e) => {
            setFilterMonth(e.target.value);
            setAppliedFilters(prev => ({ ...prev, month: e.target.value }));
          }}>
            <option value="all">Semua Bulan</option>
            <option value="01">Januari 2026</option>
            <option value="02">Februari 2026</option>
            <option value="03">Maret 2026</option>
            <option value="04">April 2026</option>
            <option value="05">Mei 2026</option>
            <option value="06">Juni 2026</option>
            <option value="07">Juli 2026</option>
            <option value="08">Agustus 2026</option>
            <option value="09">September 2026</option>
            <option value="10">Oktober 2026</option>
            <option value="11">November 2026</option>
            <option value="12">Desember 2026</option>
          </Select>
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            size="icon" 
            className={cn("shadow-sm shrink-0", hasActiveFilters && "ring-2 ring-primary")}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-0 shadow-sm bg-secondary/30">
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tipe</label>
                  <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">Semua</option>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Kategori</label>
                  <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">Semua Kategori</option>
                    {categories.filter(c => c.status === 'ACTIVE').map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Nominal Minimum</label>
                  <Input type="number" placeholder="0" value={filterMinAmount} onChange={(e) => setFilterMinAmount(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button className="w-full" onClick={handleApplyFilters}>Terapkan Filter</Button>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={handleResetFilters}>Reset</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter indicators */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {appliedFilters.type !== "all" && (
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              Tipe: {appliedFilters.type === "income" ? "Pemasukan" : "Pengeluaran"}
            </span>
          )}
          {appliedFilters.category !== "all" && (
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              Kategori: {appliedFilters.category}
            </span>
          )}
          {appliedFilters.minAmount && (
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              Min: {formatRupiah(parseInt(appliedFilters.minAmount))}
            </span>
          )}
          <button onClick={handleResetFilters} className="text-xs text-destructive hover:underline font-medium">
            Hapus semua filter
          </button>
        </div>
      )}

      {/* Transaction List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((transaction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={transaction.id}
            >
              <Card 
                className="border-0 shadow-sm hover:shadow-md transition-shadow group cursor-pointer overflow-hidden relative"
                onClick={(e) => {
                  // Only handle edit if not clicking the more button
                  if (!e.target.closest('.more-btn')) {
                    handleEdit(transaction.id);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    isOpen: true,
                    position: { x: e.clientX, y: e.clientY },
                    selectedItem: { id: transaction.id, description: transaction.name }
                  });
                }}
              >
                {/* Active Indicator on hover */}
                <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity", transaction.type === 'income' ? 'bg-green-500' : 'bg-destructive')} />
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("hidden sm:flex w-12 h-12 rounded-full items-center justify-center transition-colors", transaction.type === 'income' ? 'bg-green-100 text-green-600 group-hover:bg-green-200 dark:bg-green-900/30' : 'bg-destructive/10 text-destructive group-hover:bg-destructive/20')}>
                      {transaction.type === 'income' ? <ArrowUpIcon className="w-6 h-6" /> : <ArrowDownIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 pr-2">{transaction.name}</h3>
                      <div className="flex flex-wrap items-center text-xs text-muted-foreground mt-1.5 gap-2">
                        <span className="bg-secondary px-2 py-0.5 rounded-full font-medium">{transaction.category}</span>
                        <span>{formatDateForDisplay(transaction.date)}</span>
                        {transaction.volume && transaction.unitPrice && (
                          <span className="text-primary/70 font-medium">
                            &bull; {transaction.volume} {transaction.unit} x {formatRupiah(transaction.unitPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("font-bold text-base", transaction.type === 'income' && "text-green-600 dark:text-green-500")}>
                      {transaction.type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="more-btn h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setContextMenu({
                          isOpen: true,
                          position: { x: rect.left - 150, y: rect.bottom + 5 },
                          selectedItem: { id: transaction.id, description: transaction.name }
                        });
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    {/* Always visible on mobile */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="more-btn h-8 w-8 text-muted-foreground md:hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setContextMenu({
                          isOpen: true,
                          position: { x: Math.max(10, rect.left - 150), y: rect.bottom + 5 },
                          selectedItem: { id: transaction.id, description: transaction.name }
                        });
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed"
        >
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Tidak ada transaksi ditemukan</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
            Coba ubah kata kunci pencarian atau filter Anda untuk menemukan transaksi.
          </p>
          <Button variant="outline" onClick={() => { setSearchTerm(""); handleResetFilters(); }}>Reset Pencarian</Button>
        </motion.div>
      )}

      <ContextMenu 
        position={contextMenu.position}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        selectedItem={contextMenu.selectedItem}
        onEdit={() => handleEdit(contextMenu.selectedItem?.id)}
        onDuplicate={() => handleDuplicate(contextMenu.selectedItem?.id)}
        onDelete={() => deleteTransaction(contextMenu.selectedItem?.id)}
        onPrint={() => window.print()}
      />

      <EditTransactionModal 
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, transaction: null })}
        transaction={editModal.transaction}
      />
    </div>
  );
}
