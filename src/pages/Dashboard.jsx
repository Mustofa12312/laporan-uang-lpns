import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Wallet, TrendingUp, FileText, PieChartIcon, ArrowRight, ArrowUpIcon, ArrowDownIcon, MoreHorizontal } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from "../utils/utils";
import { useStore } from "../store/useStore";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const trendData = [
    { name: 'Apr', Pemasukan: 15000000, Pengeluaran: 12000000 },
    { name: 'Mei', Pemasukan: 18000000, Pengeluaran: 14500000 },
    { name: 'Jun', Pemasukan: 20000000, Pengeluaran: 19000000 },
    { name: 'Jul', Pemasukan: 22000000, Pengeluaran: 15000000 },
    { name: 'Ags', Pemasukan: 17000000, Pengeluaran: 16500000 },
    { name: 'Sep', Pemasukan: 20000000, Pengeluaran: 12500000 },
  ];

  const { transactions, activeBranch } = useStore();
  
  // Filter by branch
  const branchTransactions = transactions.filter(t => t.branch === activeBranch);
  
  // Compute Totals
  const totalIncome = branchTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = branchTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  const budget = 20000000;
  const budgetPercentage = Math.min(100, Math.round((totalExpense / budget) * 100));

  // Compute Chart Data for Expenses
  const categoryTotals = {};
  branchTransactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  
  const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff'];
  const chartData = Object.keys(categoryTotals).map((key, index) => ({
    name: key,
    value: categoryTotals[key],
    color: colors[index % colors.length]
  })).sort((a,b) => b.value - a.value);

  const recentTransactions = branchTransactions.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // BarChart Tooltip
      if (payload[0].dataKey) {
        return (
          <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
            <p className="font-semibold text-foreground mb-2">{label}</p>
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                <span className="text-muted-foreground">{entry.name}:</span>
                <span className="font-medium text-foreground">{formatRupiah(entry.value)}</span>
              </div>
            ))}
          </div>
        );
      }
      
      // PieChart Tooltip
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-primary font-bold mt-1">
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Ringkasan arus kas keuangan LPNS</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex shadow-sm">Bulan Ini</Button>
          <Button className="shadow-lg shadow-primary/25">Unduh Laporan</Button>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Balance */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden h-[120px]">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-16 h-16" /></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Kas Berjalan</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-32 mt-1" /> : (
                <>
                  <div className="text-3xl font-bold text-foreground">{formatRupiah(currentBalance)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Sisa kas yang tersedia</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Income */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm relative overflow-hidden h-[120px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-32 mt-1" /> : (
                <>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">{formatRupiah(totalIncome)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 font-medium inline-flex items-center"><ArrowUpIcon className="mr-1 h-3 w-3" /> Pemasukan Tercatat</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm relative overflow-hidden h-[120px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive transform rotate-180" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-32 mt-1" /> : (
                <>
                  <div className="text-2xl font-bold text-destructive">{formatRupiah(totalExpense)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-destructive font-medium inline-flex items-center"><ArrowDownIcon className="mr-1 h-3 w-3" /> Transaksi Keluar</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Budget */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm relative overflow-hidden h-[120px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status Anggaran</CardTitle>
              <PieChartIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                <>
                  <div className="text-2xl font-bold text-foreground">{budgetPercentage}%</div>
                  <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={cn("h-full rounded-full", budgetPercentage > 90 ? "bg-destructive" : "bg-primary")} style={{ width: `${budgetPercentage}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Penggunaan dari {formatRupiah(budget)}</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Bar Chart (Trend) */}
        <Card className="col-span-1 lg:col-span-4 border-0 shadow-md h-[400px]">
          <CardHeader>
            <CardTitle>Tren Arus Kas (6 Bulan Terakhir)</CardTitle>
            <CardDescription>Perbandingan historis pemasukan dan pengeluaran</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `Rp${val/1000000}M`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             )}
          </CardContent>
        </Card>

        {/* Pie Chart & Recent Trans */}
        <div className="col-span-1 lg:col-span-3 space-y-4 flex flex-col h-[400px]">
          {/* Pie Chart Simplified */}
          <Card className="border-0 shadow-md flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribusi Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent className="h-[120px]">
              {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="h-20 w-20 rounded-full" />
                  </div>
              ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Recent Trans */}
          <Card className="border-0 shadow-md flex-[2] overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2 pb-2">
              <div className="space-y-4">
                {isLoading ? (
                  [1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-2 w-12" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (index * 0.1) }} key={transaction.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", transaction.type === 'income' ? 'bg-green-100 text-green-600 group-hover:bg-green-200 dark:bg-green-900/30' : 'bg-destructive/10 text-destructive group-hover:bg-destructive/20')}>
                          {transaction.type === 'income' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-none group-hover:text-primary transition-colors">{transaction.name}</p>
                          <div className="flex items-center text-[10px] text-muted-foreground mt-1 gap-1.5">
                            <span className="bg-secondary px-1 py-0.5 rounded font-medium">{transaction.category}</span>
                            <span>{transaction.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className={cn("font-semibold text-xs", transaction.type === 'income' ? "text-green-600 dark:text-green-500" : "text-foreground")}>
                        {transaction.type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
