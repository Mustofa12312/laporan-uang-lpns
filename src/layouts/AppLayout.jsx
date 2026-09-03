import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings as SettingsIcon, 
  LogOut,
  Menu,
  Users,
  Building,
  Building2,
  BookOpen,
  Bell,
  Search
} from "lucide-react";
import { Button } from "../components/ui/button";
import CommandPalette from "../components/CommandPalette";
import { useStore } from "../store/useStore";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeBranch, setActiveBranch } = useStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transaksi", path: "/transactions", icon: Receipt },
    { name: "Laporan", path: "/reports", icon: PieChart },
    { name: "Buku Besar", path: "/ledger", icon: BookOpen },
    { name: "Pengguna", path: "/users", icon: Users },
    { name: "Pengaturan", path: "/settings", icon: SettingsIcon },
  ];

  const branches = ["Pusat", "Cabang Jakarta", "Cabang Bandung"];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 border-r bg-card z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 text-primary">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">LPNS</h1>
              <p className="text-xs text-muted-foreground">Laporan Keuangan</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link key={item.name} to={item.path}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className={`w-full justify-start ${isActive ? 'bg-primary/10 text-primary font-medium hover:bg-primary/15' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-3 h-5 w-5" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">



            {/* Global Search Button */}
            <Button 
              variant="outline" 
              className="hidden md:flex gap-2 text-muted-foreground w-48 justify-start bg-secondary/50 border-border/50 shadow-sm rounded-full"
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Cari...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">Ctrl</span>K
              </kbd>
            </Button>
          </div>

          <div className="flex items-center gap-3">

            {/* Notification Center */}
            <div className="relative group">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
              </Button>
              <div className="absolute right-0 mt-2 w-80 bg-popover border shadow-lg rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 origin-top-right">
                <div className="p-3 border-b bg-secondary/30 flex justify-between items-center">
                  <h4 className="font-semibold text-sm">Notifikasi</h4>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Tandai dibaca</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 border-b hover:bg-secondary/20 cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground leading-tight font-medium">Transaksi Baru Ditambahkan</p>
                      <p className="text-xs text-muted-foreground mt-1">Ahmad mencatat Dana Kampus Rp10.000.000</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Baru saja</p>
                    </div>
                  </div>
                  <div className="p-3 border-b hover:bg-secondary/20 cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                      <PieChart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground leading-tight font-medium">Peringatan Anggaran</p>
                      <p className="text-xs text-muted-foreground mt-1">Sisa anggaran bulan ini tinggal 30%</p>
                      <p className="text-[10px] text-muted-foreground mt-1">2 jam yang lalu</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 text-center bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors text-xs font-medium text-primary">
                  Lihat Semua
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block border-l pl-3 ml-1">
              <p className="text-sm font-medium leading-none text-foreground">Ahmad Admin</p>
              <p className="text-xs text-muted-foreground mt-1">Admin Pusat</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 cursor-pointer hover:scale-105 transition-transform">
              <span className="text-sm font-bold text-primary">AA</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24 md:p-8">
          <Outlet />
        </main>
        
        {/* Bottom Navigation - Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 px-2 pb-safe">
          <div className="flex items-center justify-around h-16">
            {[
              { name: "Beranda", path: "/", icon: LayoutDashboard },
              { name: "Transaksi", path: "/transactions", icon: Receipt },
              { name: "Laporan", path: "/reports", icon: PieChart },
              { name: "Settings", path: "/settings", icon: SettingsIcon }
            ].map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      
      <CommandPalette isOpen={isCommandOpen} setIsOpen={setIsCommandOpen} />
    </div>
  );
}
