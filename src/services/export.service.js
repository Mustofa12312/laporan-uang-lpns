import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Export to Excel with multiple sheets
export const exportToExcel = (transactions, periodName) => {
  if (!transactions || transactions.length === 0) return;

  const wb = XLSX.utils.book_new();

  // Create a summary sheet
  const summaryData = [
    ["LAPORAN PENGELUARAN KEUANGAN LPNS"],
    ["Periode:", periodName],
    [""],
    ["ID", "Tanggal", "Nama Pengeluaran", "Kategori", "Nominal", "Keterangan"]
  ];

  transactions.forEach((t) => {
    summaryData.push([t.id, t.date, t.name, t.category, t.amount, t.description || ""]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Semua Transaksi");

  // Create dynamic sheets for each category
  const categories = [...new Set(transactions.map((t) => t.category))];
  
  categories.forEach(category => {
    const catTransactions = transactions.filter(t => t.category === category);
    const catData = [
      [`PENGELUARAN KATEGORI: ${category}`],
      ["Periode:", periodName],
      [""],
      ["ID", "Tanggal", "Nama Pengeluaran", "Nominal", "Keterangan"]
    ];

    let total = 0;
    catTransactions.forEach((t) => {
      catData.push([t.id, t.date, t.name, t.amount, t.description || ""]);
      total += t.amount;
    });

    catData.push(["", "", "TOTAL", total, ""]);

    const ws = XLSX.utils.aoa_to_sheet(catData);
    
    // Ensure sheet name is valid (max 31 chars)
    const sheetName = category.substring(0, 30);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, `Laporan_LPNS_${periodName.replace(" ", "_")}.xlsx`);
};


// Export to PDF
export const exportToPDF = (transactions, periodName, isApproved = false) => {
  if (!transactions || transactions.length === 0) return;

  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Laporan Pengeluaran LPNS", 14, 15);
  doc.setFontSize(11);
  doc.text(`Periode: ${periodName}`, 14, 23);

  if (isApproved) {
    doc.setTextColor(39, 174, 96); // Green
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("[ DISETUJUI ]", 14, 28);
    doc.setTextColor(0, 0, 0); // Reset
    doc.setFont("helvetica", "normal");
  } else {
    doc.setTextColor(231, 76, 60); // Red
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("[ DRAFT / BELUM DISETUJUI ]", 14, 28);
    doc.setTextColor(0, 0, 0); // Reset
    doc.setFont("helvetica", "normal");
  }

  const tableColumn = ["ID", "Tanggal", "Nama Pengeluaran", "Kategori", "Nominal"];
  const tableRows = [];

  let totalAmount = 0;

  transactions.forEach(t => {
    const row = [
      t.id, 
      t.date, 
      t.name, 
      t.category, 
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(t.amount)
    ];
    tableRows.push(row);
    totalAmount += t.amount;
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] }, // Primary color tint
    foot: [
        [{ content: 'TOTAL', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } }, new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalAmount)]
    ],
    footStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold' }
  });

  if (isApproved) {
    // Add digital signature placeholder
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(10);
    doc.text("Disetujui Oleh:", 140, finalY + 20);
    doc.setFont("helvetica", "bold");
    doc.text("Ketua LPNS", 140, finalY + 40);
  }

  doc.save(`Laporan_LPNS_${periodName.replace(" ", "_")}.pdf`);
};
