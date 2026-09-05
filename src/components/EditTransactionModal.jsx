import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/utils";
import { useStore } from "../store/useStore";
import { useAuth } from "../contexts/AuthContext";
import { updateTransaction } from "../services/transaction.service";
import { toast } from "react-hot-toast";

export default function EditTransactionModal({ isOpen, onClose, transaction }) {
  const { categories } = useStore();
  const { currentUser } = useAuth();

  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [txType, setTxType] = useState("expense");
  const [volume, setVolume] = useState(1);
  const [unit, setUnit] = useState("Buah");
  const [unitPrice, setUnitPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when transaction changes
  useEffect(() => {
    if (transaction) {
      setDate(transaction.date || "");
      setCategory(transaction.category || "");
      setName(transaction.name || "");
      setTxType(transaction.type || "expense");
      setVolume(transaction.volume || 1);
      setUnit(transaction.unit || "Buah");
      setUnitPrice(transaction.unitPrice || "");
      setNotes(transaction.notes || "");
    }
  }, [transaction]);

  const amount = (volume || 0) * (unitPrice || 0);

  const formatRupiah = (val) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!category || !name || !amount) {
      toast.error("Mohon lengkapi semua data wajib");
      return;
    }

    setIsLoading(true);
    
    try {
      await updateTransaction(transaction.id, {
        name,
        category,
        date,
        amount: parseInt(amount),
        type: txType,
        notes,
        volume,
        unit,
        unitPrice: parseInt(unitPrice)
      }, currentUser);

      setTimeout(() => {
        setIsLoading(false);
        onClose();
        toast.success("Transaksi berhasil diperbarui");
      }, 300);
    } catch (error) {
      console.error("Gagal mengupdate transaksi:", error);
      setIsLoading(false);
      toast.error(error.message || "Gagal mengupdate transaksi");
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-card border shadow-2xl rounded-xl z-[100] overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-secondary/20">
              <h2 className="text-lg font-bold text-foreground">Edit Transaksi</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6">
              <form id="edit-tx-form" onSubmit={handleSave} className="space-y-4">
                
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button"
                    variant={txType === "expense" ? "default" : "outline"}
                    className={cn("w-full", txType === "expense" && "bg-destructive hover:bg-destructive/90")}
                    onClick={() => setTxType("expense")}
                  >
                    Pengeluaran
                  </Button>
                  <Button 
                    type="button"
                    variant={txType === "income" ? "default" : "outline"}
                    className={cn("w-full", txType === "income" && "bg-green-600 hover:bg-green-700")}
                    onClick={() => setTxType("income")}
                  >
                    Pemasukan
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Tanggal</label>
                    <Input type="date" required value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Kategori</label>
                    <Select required value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="">Pilih</option>
                      {categories.filter(c => c.status === 'ACTIVE').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Keterangan</label>
                  <Input required value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Volume</label>
                    <Input type="number" min="1" required value={volume} onChange={e => setVolume(parseInt(e.target.value) || '')} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Satuan</label>
                    <Select required value={unit} onChange={e => setUnit(e.target.value)}>
                      {["Orang", "Buah", "Paket", "Set", "Lembar", "Rim", "Botol", "Porsi", "Dus", "Lusin", "Meter", "Kg", "Liter", "Unit", "Kali"].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Harga Satuan</label>
                    <Input type="number" min="1" required value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
                  </div>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg border border-secondary/50">
                  <p className="text-xs text-muted-foreground">Total Nominal</p>
                  <p className={cn("text-xl font-bold", txType === "income" ? "text-green-600" : "text-destructive")}>
                    {formatRupiah(amount)}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Catatan (Opsional)</label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Detail tambahan..." />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t bg-secondary/10">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
              <Button type="submit" form="edit-tx-form" className="flex-1 shadow-lg shadow-primary/25" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
