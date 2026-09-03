import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Search, UserPlus, Shield, User, Power, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockUsers = [
    { id: 1, name: "Admin Utama", email: "admin@lpns.org", role: "ADMIN", status: "ACTIVE", lastLogin: "03 Sep 2026, 09:00" },
    { id: 2, name: "Ketua LPNS", email: "ketua@lpns.org", role: "KETUA", status: "ACTIVE", lastLogin: "01 Sep 2026, 14:30" },
    { id: 3, name: "Sekretaris", email: "sekretaris@lpns.org", role: "SEKRETARIS", status: "ACTIVE", lastLogin: "02 Sep 2026, 10:15" },
    { id: 4, name: "Bendahara", email: "bendahara@lpns.org", role: "BENDAHARA", status: "ACTIVE", lastLogin: "03 Sep 2026, 11:20" },
    { id: 5, name: "Mantan Pengurus", email: "mantan@lpns.org", role: "BENDAHARA", status: "INACTIVE", lastLogin: "15 Jan 2026, 08:00" },
  ];

  const filtered = mockUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const RoleBadge = ({ role }) => {
    let color = "bg-secondary text-secondary-foreground";
    if (role === "ADMIN") color = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (role === "KETUA") color = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    
    return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{role}</span>;
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
        <Button className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className={`h-8 w-8 ${user.status === 'INACTIVE' ? 'text-green-500 hover:text-green-600' : 'text-destructive hover:text-destructive'}`}>
                      <Power className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
