import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Search, Filter, Plus, FileText, ArrowDownIcon, ArrowUpIcon, FileDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/utils";
import ContextMenu from "../components/ContextMenu";
import { useStore } from "../store/useStore";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    selectedItem: null
  });

  const { transactions, activeBranch, deleteTransaction } = useStore();

  const filtered = transactions.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    t.branch === activeBranch
  );

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transaksi</h1>
          <p className="text-muted-foreground mt-1">Kelola pencatatan arus kas (Pemasukan & Pengeluaran)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex shadow-sm">
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
          <Select className="w-[140px] shadow-sm hidden sm:flex">
            <option value="all">Bulan Ini</option>
            <option value="aug">Agustus 2026</option>
            <option value="jul">Juli 2026</option>
          </Select>
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            size="icon" 
            className="shadow-sm shrink-0"
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
                  <Select>
                    <option value="all">Semua</option>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Kategori</label>
                  <Select>
                    <option value="all">Semua Kategori</option>
                    <option value="atk">ATK</option>
                    <option value="honor">Honorium</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Nominal Minimum</label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Status Bukti</label>
                  <Select>
                    <option value="all">Semua</option>
                    <option value="with">Dengan Bukti</option>
                    <option value="without">Tanpa Bukti</option>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Terapkan Filter</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{transaction.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1.5 gap-2">
                        <span className="bg-secondary px-2 py-0.5 rounded-full font-medium">{transaction.category}</span>
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn("font-bold text-base", transaction.type === 'income' && "text-green-600 dark:text-green-500")}>
                      {transaction.type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 hidden sm:inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Tanpa Bukti
                    </span>
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
          <Button variant="outline" onClick={() => setSearchTerm("")}>Reset Pencarian</Button>
        </motion.div>
      )}

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
