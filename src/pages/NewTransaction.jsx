import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Check, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/utils";
import { useStore } from "../store/useStore";

export default function NewTransaction() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txType, setTxType] = useState("expense"); // 'income' | 'expense'
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  
  // Rincian Biaya
  const [volume, setVolume] = useState(1);
  const [unit, setUnit] = useState("Buah");
  const [unitPrice, setUnitPrice] = useState("");
  
  const amount = (volume || 0) * (unitPrice || 0);

  const [notes, setNotes] = useState("");

  const { addTransaction, activeBranch, categories } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !name || !amount) return;

    setIsLoading(true);
    
    // Add to Global Store
    addTransaction({
      name,
      category,
      date,
      amount: parseInt(amount),
      type: txType,
      branch: activeBranch,
      notes,
      volume,
      unit,
      unitPrice: parseInt(unitPrice)
    });

    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/transactions");
      }, 1500);
    }, 600);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <Check className="w-12 h-12" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-foreground"
        >
          Berhasil Disimpan
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-muted-foreground mt-2"
        >
          Mengarahkan kembali...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Catat Transaksi</h1>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tanggal <span className="text-destructive">*</span></label>
                  <Input type="date" required value={date} onChange={e => setDate(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori <span className="text-destructive">*</span></label>
                  <Select required value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Pilih Kategori</option>
                    {categories.filter(c => c.status === 'ACTIVE').map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keterangan <span className="text-destructive">*</span></label>
                <Input placeholder={txType === 'income' ? "Misal: Pencairan Dana Kampus" : "Misal: Beli kertas A4"} required value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume <span className="text-destructive">*</span></label>
                  <Input type="number" placeholder="1" required min="1" value={volume} onChange={e => setVolume(parseInt(e.target.value) || '')} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Satuan <span className="text-destructive">*</span></label>
                  <Select required value={unit} onChange={e => setUnit(e.target.value)}>
                    {["Orang", "Buah", "Paket", "Set", "Lembar", "Rim", "Botol", "Porsi", "Dus", "Lusin", "Meter", "Kg", "Liter", "Unit", "Kali"].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Harga Satuan <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-muted-foreground font-medium">Rp</span>
                    </div>
                    <Input type="number" placeholder="0" className="pl-10" required min="1" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-secondary/30 p-4 rounded-xl border border-secondary/50">
                <label className="text-sm font-medium text-muted-foreground">Total Nominal (Otomatis)</label>
                <div className="text-2xl font-bold text-destructive">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catatan Tambahan (Opsional)</label>
                <Textarea placeholder="Detail lebih lanjut..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>


              <div className="pt-4 flex gap-3 border-t">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>Batal</Button>
                <Button type="submit" className={cn("flex-1 shadow-lg shadow-primary/25", txType === 'income' && "bg-green-600 hover:bg-green-700")} disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
