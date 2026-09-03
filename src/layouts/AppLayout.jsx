import { useState } from "react";
import { Link, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings as SettingsIcon, 
  LogOut,
  Users,
  Building,
  BookOpen,
  Bell,
  Search
} from "lucide-react";
import { Button } from "../components/ui/button";
import CommandPalette from "../components/CommandPalette";
import { useStore } from "../store/useStore";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayout() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { activeBranch } = useStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth Guard: redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transaksi", path: "/transactions", icon: Receipt },
    { name: "Laporan", path: "/reports", icon: PieChart },
    { name: "Buku Besar", path: "/ledger", icon: BookOpen },
    { name: "Pengguna", path: "/users", icon: Users },
    { name: "Pengaturan", path: "/settings", icon: SettingsIcon },
  ];

  const userInitials = currentUser?.name
    ? currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

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
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
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
              </Button>
            </div>

            <div className="text-right hidden sm:block border-l pl-3 ml-1">
              <p className="text-sm font-medium leading-none text-foreground">{currentUser?.name || "User"}</p>
              <p className="text-xs text-muted-foreground mt-1">{currentUser?.role || "—"} • {activeBranch}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 cursor-pointer hover:scale-105 transition-transform">
              <span className="text-sm font-bold text-primary">{userInitials}</span>
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
              { name: "Pengguna", path: "/users", icon: Users },
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
