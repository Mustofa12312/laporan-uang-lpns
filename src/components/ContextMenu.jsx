import { useEffect, useRef } from "react";
import { Edit2, Copy, Trash2, Printer } from "lucide-react";

export default function ContextMenu({ 
  position, 
  isOpen, 
  onClose, 
  selectedItem,
  onEdit,
  onDuplicate,
  onDelete,
  onPrint
}) {
  const menuRef = useRef(null);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      // Close on scroll
      document.addEventListener("scroll", onClose, { passive: true });
    }
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", onClose);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !selectedItem) return null;

  // Ensure menu doesn't go off-screen
  const menuStyle = {
    top: position.y,
    left: position.x,
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[999] w-48 bg-popover border shadow-lg rounded-lg overflow-hidden flex flex-col py-1 text-sm animate-in fade-in zoom-in-95 duration-150"
      style={menuStyle}
    >
      <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1 truncate">
        {selectedItem.description || "Opsi Transaksi"}
      </div>
      
      <button 
        onClick={() => { onEdit(); onClose(); }}
        className="w-full text-left px-3 py-1.5 hover:bg-secondary/50 flex items-center gap-2 text-foreground"
      >
        <Edit2 className="w-4 h-4 text-primary" /> Edit Data
      </button>
      
      <button 
        onClick={() => { onDuplicate(); onClose(); }}
        className="w-full text-left px-3 py-1.5 hover:bg-secondary/50 flex items-center gap-2 text-foreground"
      >
        <Copy className="w-4 h-4 text-blue-500" /> Gandakan (Duplikat)
      </button>

      <button 
        onClick={() => { onPrint(); onClose(); }}
        className="w-full text-left px-3 py-1.5 hover:bg-secondary/50 flex items-center gap-2 text-foreground"
      >
        <Printer className="w-4 h-4 text-muted-foreground" /> Cetak Baris
      </button>

      <div className="h-px bg-border my-1"></div>

      <button 
        onClick={() => { onDelete(); onClose(); }}
        className="w-full text-left px-3 py-1.5 hover:bg-destructive/10 flex items-center gap-2 text-destructive font-medium"
      >
        <Trash2 className="w-4 h-4" /> Hapus Transaksi
      </button>
    </div>
  );
}
