import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Settings, Moon, Sun, BookOpen, Receipt, LayoutDashboard, X, Terminal } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function CommandPalette({ isOpen, setIsOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchQuery("");
    }
  }, [isOpen]);

  const commands = [
    { id: "dashboard", title: "Ke Dashboard", icon: LayoutDashboard, action: () => navigate("/") },
    { id: "new-trans", title: "Catat Transaksi Baru", icon: Receipt, action: () => navigate("/transactions/new") },
    { id: "trans", title: "Lihat Daftar Transaksi", icon: FileText, action: () => navigate("/transactions") },
    { id: "ledger", title: "Buka Buku Besar (Akuntansi)", icon: BookOpen, action: () => navigate("/ledger") },
    { id: "settings", title: "Pengaturan & Profil", icon: Settings, action: () => navigate("/settings") },
    { id: "dark", title: "Ubah ke Tema Gelap (Dark Mode)", icon: Moon, action: () => setTheme("dark") },
    { id: "light", title: "Ubah ke Tema Terang (Light Mode)", icon: Sun, action: () => setTheme("light") },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const executeCommand = (action) => {
    action();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-card border shadow-2xl rounded-xl z-[100] overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-border gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Ketik perintah atau cari halaman..."
                className="flex-1 bg-transparent outline-none text-foreground text-sm font-medium placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-1.5 bg-secondary px-1.5 py-1 rounded text-[10px] font-semibold text-muted-foreground border">
                ESC
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Aksi Cepat
                  </div>
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd.action)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground group transition-colors text-left"
                    >
                      <cmd.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground" />
                      <span className="text-sm font-medium">{cmd.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">Tidak ada perintah yang cocok untuk "{searchQuery}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
