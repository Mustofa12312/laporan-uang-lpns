import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Search, UserPlus, Shield, User, Power, Edit, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { createUserDocument, updateUser, deleteUser } from "../services/user.service";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const { users } = useStore();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "BENDAHARA" });

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RoleBadge = ({ role }) => {
    let color = "bg-secondary text-secondary-foreground";
    if (role === "ADMIN") color = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (role === "KETUA") color = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    if (role === "SEKRETARIS") color = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (role === "BENDAHARA") color = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    
    return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{role}</span>;
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "BENDAHARA" });
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      if (editingUser) {
        const updates = { name: formData.name, email: formData.email, role: formData.role };
        await updateUser(editingUser.id, updates);
      } else {
        if (!formData.password) return;
        // In a real app, this should call a Cloud Function to create the Auth user securely
        // For now, we simulate by creating the document directly
        await createUserDocument(`USR-${Date.now()}`, { 
          name: formData.name, 
          email: formData.email, 
          role: formData.role, 
          status: "ACTIVE", 
          lastLogin: "Belum pernah login" 
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error("Gagal menyimpan user:", error);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await updateUser(user.id, { status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
    } catch (error) {
      console.error("Gagal toggle status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Pengguna <Shield className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1">Manajemen akses aplikasi (Khusus Admin)</p>
        </div>
        <Button className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform" onClick={handleOpenAdd}>
          <UserPlus className="mr-2 h-4 w-4" /> Tambah User
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Cari nama atau email..." 
          className="pl-9 bg-background shadow-sm" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((user, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={user.id}
          >
            <Card className={`border-0 shadow-sm relative overflow-hidden ${user.status === 'INACTIVE' ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <RoleBadge role={user.role} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-foreground line-clamp-1">{user.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{user.email}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Terakhir Login: <br />
                    <span className="font-medium text-foreground">{user.lastLogin}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenEdit(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${user.status === 'INACTIVE' ? 'text-green-500 hover:text-green-600' : 'text-destructive hover:text-destructive'}`}
                      onClick={() => handleToggleStatus(user)}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99]"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-md bg-card border shadow-2xl rounded-xl z-[100] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b bg-secondary/20">
                <h2 className="text-lg font-bold text-foreground">
                  {editingUser ? "Edit User" : "Tambah User Baru"}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Nama Lengkap</label>
                  <Input required value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <Input type="email" required value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Password {editingUser && <span className="text-muted-foreground">(kosongkan jika tidak diubah)</span>}
                  </label>
                  <Input 
                    type="password" 
                    required={!editingUser} 
                    value={formData.password} 
                    onChange={(e) => setFormData(p => ({...p, password: e.target.value}))} 
                    placeholder={editingUser ? "••••••••" : "Masukkan password"}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Role</label>
                  <Select value={formData.role} onChange={(e) => setFormData(p => ({...p, role: e.target.value}))}>
                    <option value="ADMIN">Admin</option>
                    <option value="KETUA">Ketua</option>
                    <option value="SEKRETARIS">Sekretaris</option>
                    <option value="BENDAHARA">Bendahara</option>
                  </Select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Batal</Button>
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingUser ? "Simpan Perubahan" : "Tambah User"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
