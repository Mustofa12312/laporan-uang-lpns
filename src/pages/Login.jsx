import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-2xl shadow-primary/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
        <CardHeader className="space-y-3 pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 transform -rotate-6">
            <Lock className="w-8 h-8 text-primary transform rotate-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Laporan Uang LPNS
          </CardTitle>
          <CardDescription className="text-base">
            Masuk untuk mengelola keuangan organisasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="nama@lpns.org"
                  className="pl-10 h-11 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-4 w-4" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                Lupa password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base shadow-lg shadow-primary/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pb-8 pt-2">
          <p className="text-sm text-muted-foreground">
            Hanya untuk pengurus internal LPNS
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
