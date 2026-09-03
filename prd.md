# PRD — Laporang Uang LPNS

**Product Requirements Document**
**Nama Produk:** Laporang Uang LPNS
**Jenis:** Web Application — Sistem Pelaporan Keuangan Bulanan
**Platform:** Mobile-first Web + Desktop
**Status:** Draft V1

---

## 1. Ringkasan Produk

**Laporang Uang LPNS** adalah aplikasi web modern untuk mencatat, mengelola, memantau, dan melaporkan seluruh **pengeluaran organisasi LPNS** secara digital.

Aplikasi dirancang dengan pendekatan **mobile-first**, karena mayoritas aktivitas dilakukan melalui HP Android. Versi desktop tetap disediakan untuk aktivitas yang membutuhkan layar lebih besar seperti pengelolaan data, analisis, dan pembuatan laporan.

Sistem menggantikan pencatatan manual maupun Google Form dengan satu aplikasi terintegrasi.

### Arsitektur utama

```text
                    Laporang Uang LPNS
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Mobile                     Desktop
             │                           │
             └─────────────┬─────────────┘
                           │
                    React + Vite
                           │
                    Tailwind CSS
                           │
                        Axios
                           │
                     Firebase
             ┌─────────────┼─────────────┐
             │             │             │
       Authentication   Firestore    Storage
             │             │             │
          User Login    Transaksi    Bukti Foto
                           │
                           ▼
                     Laporan & Analitik
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
            PDF          Excel          CSV
```

---

# 2. Tujuan Produk

Tujuan utama aplikasi:

1. Mempermudah pencatatan pengeluaran.
2. Mengurangi kesalahan pencatatan manual.
3. Menyimpan bukti transaksi secara digital.
4. Mempermudah pencarian transaksi.
5. Menghasilkan laporan bulanan otomatis.
6. Menghasilkan laporan tahunan.
7. Menyediakan dashboard keuangan.
8. Menyediakan analitik berdasarkan kategori.
9. Mempermudah proses audit.
10. Mengetahui siapa yang membuat dan mengubah transaksi.
11. Menghasilkan file Excel yang terstruktur berdasarkan kategori.
12. Menyediakan laporan yang siap dicetak.

---

# 3. Visi Produk

> **Menjadi sistem pelaporan keuangan LPNS yang modern, sederhana, transparan, aman, dan mudah digunakan dari HP maupun komputer.**

Prinsip utama:

- **Simple**
- **Mobile First**
- **Transparent**
- **Secure**
- **Professional**
- **Auditable**

---

# 4. Target Pengguna

Sistem digunakan oleh satu organisasi:

**LPNS**

Pengguna utama:

| Pengguna   | Fungsi                                |
| ---------- | ------------------------------------- |
| Admin      | Mengelola akun dan konfigurasi sistem |
| Ketua      | Mengelola dan melihat laporan         |
| Sekretaris | Mencatat dan mengelola transaksi      |
| Bendahara  | Mencatat dan mengelola transaksi      |

Pada V1, **Ketua, Sekretaris, dan Bendahara memiliki hak akses transaksi yang sama**.

Admin memiliki hak administratif khusus.

---

# 5. Scope V1

## 5.1 Termasuk

### Authentication

- Login
- Logout
- Ganti password
- Reset password
- Session management
- Protected route

### User Management

- Membuat user
- Melihat user
- Mengubah user
- Menonaktifkan user
- Mengatur role
- Reset akun user

### Transaction

- Tambah transaksi
- Lihat transaksi
- Edit transaksi
- Hapus transaksi
- Soft delete
- Detail transaksi
- Upload bukti
- Search
- Filter
- Sorting

### Category

- Tambah kategori
- Edit kategori
- Nonaktifkan kategori
- Aktifkan kembali kategori
- Urutan kategori

### Dashboard

- Total pengeluaran
- Total transaksi
- Pengeluaran bulan berjalan
- Pengeluaran tahun berjalan
- Pengeluaran berdasarkan kategori
- Grafik pengeluaran
- Transaksi terbaru

### Reports

- Laporan bulanan
- Laporan tahunan
- Filter periode
- Filter kategori
- Print
- PDF
- Excel
- CSV

### Audit

- Audit log
- Created by
- Updated by
- Deleted by
- Waktu aktivitas

### UI/UX

- Mobile-first
- Desktop responsive
- Dark mode
- Loading state
- Empty state
- Error state
- Confirmation dialog
- Toast notification

---

# 6. Tidak Termasuk V1

Tidak termasuk:

- Double-entry accounting
- Integrasi bank
- Payment gateway
- Pembayaran online
- Multi-organisasi
- Multi-cabang
- Pajak
- ERP
- Payroll
- Akuntansi jurnal
- Rekonsiliasi bank
- Integrasi marketplace

---

# 7. Prinsip Mobile First

Karena aplikasi paling banyak digunakan melalui HP, desain tidak boleh sekadar mengecilkan tampilan desktop.

Prioritas:

```text
Mobile
  ↓
Tablet
  ↓
Desktop
```

Semua fungsi utama harus dapat dilakukan dari HP.

### Fungsi yang wajib nyaman di HP

- Login
- Tambah transaksi
- Upload bukti
- Edit transaksi
- Melihat transaksi
- Search
- Filter
- Dashboard
- Melihat laporan
- Export

---

# 8. Struktur Navigasi Mobile

Bottom navigation:

```text
┌─────────────────────────────┐
│                             │
│        CONTENT AREA         │
│                             │
├─────────────────────────────┤
│ 🏠     📋      ＋      📊  ⚙️ │
│Home  Transaksi Tambah Laporan More
└─────────────────────────────┘
```

Menu:

1. Dashboard
2. Transaksi
3. Tambah
4. Laporan
5. Pengaturan

---

# 9. Struktur Navigasi Desktop

Desktop menggunakan sidebar:

```text
┌────────────────┬────────────────────────────┐
│                │                            │
│ LPNS           │       CONTENT              │
│                │                            │
│ 🏠 Dashboard   │                            │
│ 📋 Transaksi   │                            │
│ 📊 Laporan     │                            │
│ 📈 Analitik    │                            │
│ 👥 Pengguna    │                            │
│ 🗂 Kategori    │                            │
│ ⚙ Pengaturan   │                            │
│                │                            │
└────────────────┴────────────────────────────┘
```

---

# 10. Authentication

## Login

User tidak melakukan registrasi sendiri.

Akun dibuat oleh Admin.

Form:

```text
Logo LPNS

Selamat Datang

Email
[________________]

Password
[________________]

☐ Ingat saya

[ Masuk ]

Lupa password?
```

### Requirement

- Email wajib valid.
- Password wajib diisi.
- Error login harus informatif.
- Password tidak ditampilkan secara default.
- Tersedia toggle show/hide password.
- Setelah login diarahkan ke dashboard.

---

# 11. User Management

Admin dapat membuat akun.

Data user:

```text
User
├── Nama
├── Email
├── Role
├── Status
├── Created At
└── Last Login
```

Role:

```text
ADMIN
KETUA
SEKRETARIS
BENDAHARA
```

Status:

```text
ACTIVE
INACTIVE
```

User nonaktif tidak dapat login.

---

# 12. Permission

### V1

| Fitur            | Admin |    Ketua    | Sekretaris | Bendahara |
| ---------------- | :---: | :---------: | :--------: | :-------: |
| Login            |  ✅   |     ✅      |     ✅     |    ✅     |
| Dashboard        |  ✅   |     ✅      |     ✅     |    ✅     |
| Tambah transaksi |  ✅   |     ✅      |     ✅     |    ✅     |
| Edit transaksi   |  ✅   |     ✅      |     ✅     |    ✅     |
| Hapus transaksi  |  ✅   |     ✅      |     ✅     |    ✅     |
| Upload bukti     |  ✅   |     ✅      |     ✅     |    ✅     |
| Laporan          |  ✅   |     ✅      |     ✅     |    ✅     |
| Export           |  ✅   |     ✅      |     ✅     |    ✅     |
| Kategori         |  ✅   |     ✅      |     ✅     |    ✅     |
| User management  |  ✅   |     ❌      |     ❌     |    ❌     |
| Audit log        |  ✅   | ❌/opsional |     ❌     |    ❌     |

---

# 13. Transaction Management

## Data transaksi

Field:

| Field              | Required |
| ------------------ | :------: |
| Tanggal            |    ✅    |
| Kategori           |    ✅    |
| Nama Pengeluaran   |    ✅    |
| Deskripsi          |    ❌    |
| Nominal            |    ✅    |
| Nama Toko/Penerima |    ❌    |
| Bukti Transaksi    |    ❌    |
| Catatan            |    ❌    |

Contoh:

```text
Tanggal
3 September 2026

Kategori
ATK

Nama Pengeluaran
Beli ATK

Deskripsi
Pembelian kertas A4

Nominal
Rp150.000

Nama Toko/Penerima
Toko ABC

Bukti Transaksi
[ Upload ]

Catatan
Pembelian kebutuhan administrasi
```

---

# 14. Aturan Nominal

Nominal menggunakan:

**Rupiah / IDR**

Input:

```text
150000
```

ditampilkan:

```text
Rp150.000
```

Database menyimpan angka:

```text
150000
```

Bukan:

```text
"Rp150.000"
```

Hal ini penting untuk kalkulasi dan export.

---

# 15. Bukti Transaksi

Bukti bersifat **opsional**.

Format yang direkomendasikan:

- JPG
- JPEG
- PNG
- WEBP
- PDF

Alur:

```text
Tambah transaksi
       ↓
Upload bukti (opsional)
       ↓
Validasi file
       ↓
Firebase Storage
       ↓
URL/reference disimpan
       ↓
Transaksi tersimpan
```

Jika tidak ada bukti:

```text
Bukti: Tidak tersedia
```

Transaksi tetap valid.

---

# 16. Transaction List

Mobile:

```text
┌─────────────────────────┐
│ Transaksi               │
│                         │
│ 🔍 Cari transaksi       │
│                         │
│ [ September 2026 ▼ ]    │
│                         │
│ ATK                     │
│ Beli ATK                │
│ 03 Sep 2026             │
│ Rp150.000               │
│                         │
│ HONORIUM                │
│ Honor kegiatan          │
│ 04 Sep 2026             │
│ Rp500.000               │
└─────────────────────────┘
```

Desktop dapat menggunakan tabel.

---

# 17. Search

Search dapat mencari:

- Nama pengeluaran
- Deskripsi
- Toko/penerima
- Catatan

Contoh:

```text
🔍 "ATK"
```

Menampilkan seluruh transaksi yang relevan.

---

# 18. Filter

Filter:

### Periode

- Hari ini
- Minggu ini
- Bulan ini
- Bulan tertentu
- Tahun tertentu
- Custom date range

### Kategori

```text
Semua
ATK
HONORIUM
TRANSPORTASI
PERLENGKAPAN
...
```

### Nominal

- Minimum
- Maksimum

### User

- Semua
- Ketua
- Sekretaris
- Bendahara

### Bukti

- Semua
- Dengan bukti
- Tanpa bukti

---

# 19. Edit Transaction

Saat transaksi diedit:

```text
Transaksi
     ↓
Edit
     ↓
Validasi
     ↓
Simpan
     ↓
Audit Log
```

Sistem mencatat perubahan.

Contoh:

```text
Sebelum:
Rp150.000

Sesudah:
Rp175.000
```

---

# 20. Delete Transaction

Gunakan **Soft Delete**.

Alur:

```text
Hapus
  ↓
Konfirmasi
  ↓
Soft Delete
  ↓
deletedAt
deletedBy
  ↓
Audit Log
```

Data tidak langsung dihapus secara permanen.

Contoh:

```text
status: DELETED
deletedAt: ...
deletedBy: ...
```

Transaksi yang dihapus tidak muncul pada laporan normal.

---

# 21. Audit Log

Audit log menjadi bagian penting dari sistem.

Aktivitas:

- Login
- Logout
- Membuat transaksi
- Mengubah transaksi
- Menghapus transaksi
- Mengembalikan transaksi
- Membuat kategori
- Mengubah kategori
- Menonaktifkan kategori
- Membuat user
- Menonaktifkan user
- Mengubah password

Contoh:

```text
03 Sep 2026 09:20

Bendahara

MEMBUAT TRANSAKSI

Kategori:
ATK

Nominal:
Rp150.000
```

Perubahan:

```text
03 Sep 2026 10:15

Bendahara

MENGUBAH TRANSAKSI

Nominal:
Rp150.000 → Rp175.000
```

---

# 22. Category Management

Kategori harus **dinamis**.

Default:

```text
ATK
HONORIUM
TRANSPORTASI
PERLENGKAPAN
KONSUMSI
LAINNYA
```

Admin dapat:

- Menambah kategori
- Mengubah nama
- Menonaktifkan
- Mengaktifkan kembali
- Mengatur urutan

Contoh:

```text
Kategori

☑ ATK
☑ HONORIUM
☑ TRANSPORTASI
☑ PERLENGKAPAN
☑ KONSUMSI
☑ KEGIATAN
☐ KATEGORI LAMA
```

---

# 23. Aturan Penghapusan Kategori

Kategori **tidak boleh benar-benar dihapus jika sudah digunakan transaksi**.

Contoh:

```text
ATK
↓
Sudah digunakan 150 transaksi
↓
Tidak boleh DELETE
↓
Dapat NONAKTIFKAN
```

Dengan demikian histori laporan tetap konsisten.

---

# 24. Dashboard

Dashboard menjadi halaman pertama setelah login.

### KPI

```text
Total Pengeluaran
Rp12.500.000

Transaksi
124

Pengeluaran Bulan Ini
Rp4.250.000

Kategori
8
```

### Grafik

Minimal:

1. Pengeluaran per bulan.
2. Pengeluaran berdasarkan kategori.
3. Perbandingan bulan.

Contoh:

```text
Pengeluaran Berdasarkan Kategori

HONORIUM       ███████████
ATK            █████
TRANSPORTASI   ████
PERLENGKAPAN   ███
KONSUMSI       ██
```

---

# 25. Dashboard Mobile

Prioritas informasi:

```text
Total Pengeluaran
       ↓
Bulan Ini
       ↓
Tambah Transaksi
       ↓
Grafik kategori
       ↓
Transaksi terbaru
```

Tombol:

**+ Tambah Transaksi**

harus mudah dijangkau.

---

# 26. Laporan

Menu laporan:

```text
Laporan
├── Laporan Bulanan
├── Laporan Tahunan
└── Custom Report
```

---

# 27. Laporan Bulanan

User memilih:

```text
Bulan
[ September ▼ ]

Tahun
[ 2026 ▼ ]
```

Kemudian:

```text
Total Pengeluaran
Rp12.500.000

Jumlah Transaksi
124
```

Detail transaksi ditampilkan.

---

# 28. Laporan Tahunan

Contoh:

```text
Laporan Keuangan
Tahun 2026

Januari       Rp5.000.000
Februari      Rp4.500.000
Maret         Rp6.200.000
April         Rp7.100.000
...
```

Total:

```text
TOTAL 2026
Rp85.500.000
```

---

# 29. Export Excel

Ini merupakan salah satu requirement utama.

Sistem menghasilkan **satu file Excel**.

Contoh:

```text
Laporan_Keuangan_LPNS_September_2026.xlsx
```

Struktur:

```text
┌───────────────────────────┐
│ Ringkasan                 │
├───────────────────────────┤
│ Semua Transaksi           │
├───────────────────────────┤
│ ATK                       │
├───────────────────────────┤
│ HONORIUM                  │
├───────────────────────────┤
│ TRANSPORTASI              │
├───────────────────────────┤
│ PERLENGKAPAN              │
├───────────────────────────┤
│ KONSUMSI                  │
├───────────────────────────┤
│ KATEGORI DINAMIS...       │
└───────────────────────────┘
```

---

# 30. Sheet Ringkasan Excel

Contoh:

| Kategori     | Jumlah Transaksi |           Total |
| ------------ | ---------------: | --------------: |
| ATK          |               12 |     Rp1.500.000 |
| HONORIUM     |                8 |     Rp4.000.000 |
| TRANSPORTASI |               15 |     Rp1.250.000 |
| PERLENGKAPAN |                5 |     Rp2.100.000 |
| KONSUMSI     |                7 |       Rp900.000 |
| **TOTAL**    |           **47** | **Rp9.750.000** |

Jika kategori baru dibuat, otomatis muncul di sini.

---

# 31. Sheet Semua Transaksi

Kolom:

```text
No
Tanggal
Kategori
Nama Pengeluaran
Deskripsi
Nominal
Nama Toko/Penerima
Bukti
Catatan
Dibuat Oleh
Dibuat Pada
Terakhir Diubah Oleh
Terakhir Diubah Pada
```

Sheet ini berisi seluruh transaksi dalam periode export.

---

# 32. Sheet Kategori

Contoh sheet `ATK`:

```text
LAPORAN PENGELUARAN — ATK

No | Tanggal | Nama Pengeluaran | Deskripsi |
   | Nominal | Toko/Penerima | Bukti | Catatan
```

Di bagian bawah:

```text
TOTAL PENGELUARAN ATK
Rp1.500.000
```

Semua sheet kategori dibuat **secara dinamis**.

---

# 33. Aturan Nama Sheet Excel

Nama kategori bisa panjang atau memiliki karakter yang tidak valid untuk nama worksheet.

Sistem harus melakukan sanitasi.

Contoh:

```text
Konsumsi / Acara
```

menjadi:

```text
Konsumsi Acara
```

Jika nama terlalu panjang, dipotong secara otomatis.

Jika terdapat nama yang sama, sistem memberikan suffix.

---

# 34. Export CSV

CSV hanya menghasilkan satu dataset:

```text
No
Tanggal
Kategori
Nama Pengeluaran
Deskripsi
Nominal
Toko/Penerima
Bukti
Catatan
```

CSV ditujukan untuk kebutuhan pengolahan data lebih lanjut.

---

# 35. Export PDF

PDF ditujukan untuk laporan formal.

Struktur:

```text
LPNS

LAPORAN PENGELUARAN
September 2026

Total Pengeluaran
Rp12.500.000

Jumlah Transaksi
124

--------------------------------

No | Tanggal | Kategori | Uraian | Nominal

...

--------------------------------

TOTAL
Rp12.500.000
```

PDF harus dapat:

- Dibaca
- Dicetak
- Menggunakan ukuran A4
- Memiliki header
- Memiliki footer
- Menampilkan periode
- Menampilkan total

---

# 36. Print

Print menggunakan layout A4.

Untuk desktop:

```text
[ Print Laporan ]
```

Browser print dialog dapat digunakan.

Pada mobile, laporan tetap harus memiliki layout yang layak dicetak.

---

# 37. Responsive Design

Breakpoint minimal:

```text
Mobile
< 640px

Tablet
640–1024px

Desktop
> 1024px
```

### Mobile

- Bottom navigation
- Card
- List
- Full-width button
- Bottom sheet/modal

### Desktop

- Sidebar
- Table
- Multi-column layout
- Modal
- Dashboard grid

---

# 38. Dark Mode

Sistem mendukung:

```text
Light
Dark
System
```

Preferensi disimpan pada browser/user preference.

---

# 39. UI Design Direction

Saya merekomendasikan gaya:

### **Modern + Formal**

Bukan aplikasi administrasi yang terlihat kuno, tetapi juga tidak terlalu playful.

Karakter:

- Clean
- Profesional
- Minimal
- Banyak whitespace
- Typography jelas
- Card sederhana
- Icon konsisten
- Warna status jelas
- Form mudah digunakan dengan satu tangan

---

# 40. UX Tambah Transaksi

Ini adalah salah satu flow paling penting.

Target:

> User dapat membuat transaksi dalam waktu sesingkat mungkin.

Flow:

```text
Klik +
   ↓
Tanggal
   ↓
Kategori
   ↓
Nama Pengeluaran
   ↓
Nominal
   ↓
Field tambahan
   ↓
Upload bukti opsional
   ↓
Simpan
```

Setelah berhasil:

```text
✓ Transaksi berhasil disimpan

Rp150.000
ATK
```

Kemudian kembali ke daftar transaksi.

---

# 41. Quick Add

Karena penggunaan utama melalui HP, tombol tambah transaksi harus selalu mudah ditemukan.

Mobile:

```text
        +
```

atau:

```text
[ + Tambah Transaksi ]
```

Desktop:

```text
[ + Tambah Transaksi ]
```

---

# 42. Validation

### Tanggal

Wajib.

### Kategori

Wajib.

### Nama pengeluaran

Wajib.

### Nominal

Wajib.

Harus:

```text
> 0
```

### Deskripsi

Opsional.

### Toko/Penerima

Opsional.

### Bukti

Opsional.

### Catatan

Opsional.

---

# 43. Firebase Architecture

Firebase digunakan sebagai backend utama.

Komponen:

### Firebase Authentication

Untuk:

- Login
- Password
- Session
- Reset password

### Cloud Firestore

Untuk:

- Users
- Transactions
- Categories
- Audit Logs
- Settings

### Firebase Storage

Untuk:

- Bukti transaksi

### Cloud Functions

Direkomendasikan untuk operasi sensitif seperti:

- Membuat user
- Menghapus/menonaktifkan user
- Audit log
- Export tertentu
- Validasi server-side
- Operasi administratif

---

# 44. Struktur Firestore

Struktur utama:

```text
users
├── userId
│   ├── name
│   ├── email
│   ├── role
│   ├── status
│   ├── createdAt
│   └── updatedAt

categories
├── categoryId
│   ├── name
│   ├── status
│   ├── order
│   ├── createdAt
│   └── updatedAt

transactions
├── transactionId
│   ├── date
│   ├── categoryId
│   ├── categoryName
│   ├── expenseName
│   ├── description
│   ├── amount
│   ├── recipient
│   ├── receipt
│   ├── notes
│   ├── createdBy
│   ├── createdAt
│   ├── updatedBy
│   ├── updatedAt
│   ├── deletedBy
│   └── deletedAt

auditLogs
├── logId
│   ├── action
│   ├── entityType
│   ├── entityId
│   ├── userId
│   ├── metadata
│   └── createdAt
```

---

# 45. Snapshot Kategori

Saya merekomendasikan transaksi menyimpan:

```text
categoryId
categoryName
```

bukan hanya `categoryId`.

Contoh:

```text
categoryId:
abc123

categoryName:
ATK
```

Hal ini berguna untuk menjaga histori jika nama kategori berubah.

Misalnya:

```text
ATK
↓
diubah menjadi
↓
Alat Tulis Kantor
```

Transaksi lama tetap dapat ditampilkan dengan histori yang benar.

---

# 46. Security

Security merupakan requirement wajib.

Firebase Security Rules harus memastikan:

- User harus login.
- User hanya dapat mengakses data organisasi LPNS.
- Role divalidasi.
- User tidak dapat memanipulasi `createdBy`.
- User tidak dapat memanipulasi `createdAt`.
- User tidak dapat membuat dirinya menjadi ADMIN.
- User tidak dapat mengubah role sendiri.
- Audit log tidak dapat diedit oleh user biasa.
- Data deleted tidak dapat dimanipulasi sembarangan.

---

# 47. Audit Integrity

Data audit harus dibuat sedemikian rupa sehingga user tidak bisa menghapus histori aktivitasnya sendiri.

Idealnya:

```text
Client
  ↓
Cloud Function
  ↓
Audit Log
```

bukan:

```text
Client
  ↓
langsung menulis audit log
```

untuk aktivitas sensitif.

---

# 48. Error Handling

Sistem harus memiliki error state.

Contoh:

### Internet bermasalah

```text
⚠️ Gagal terhubung

Periksa koneksi internet Anda.
[ Coba Lagi ]
```

### Gagal upload

```text
⚠️ Bukti transaksi gagal diupload.

[ Coba Lagi ]
```

### Gagal menyimpan

```text
⚠️ Transaksi belum tersimpan.

Data Anda belum berhasil dikirim.
[ Coba Lagi ]
```

---

# 49. Loading State

Tidak boleh membuat halaman terlihat kosong ketika data sedang dimuat.

Gunakan skeleton:

```text
██████████████
████████
██████████████
```

untuk:

- Dashboard
- Transaction list
- Reports
- User list
- Category list

---

# 50. Empty State

Jika belum ada transaksi:

```text
📋

Belum ada transaksi

Belum ada pengeluaran yang tercatat
pada periode ini.

[ + Tambah Transaksi ]
```

---

# 51. Confirmation

Operasi berbahaya harus memiliki konfirmasi.

Contoh:

```text
Hapus transaksi?

Transaksi:
Beli ATK

Nominal:
Rp150.000

Data akan dipindahkan ke status
terhapus dan tercatat dalam audit log.

[ Batal ] [ Hapus ]
```

---

# 52. Performance

Target:

- Dashboard cepat dibuka.
- Query Firestore menggunakan pagination.
- Tidak mengambil seluruh transaksi sekaligus.
- Gambar bukti menggunakan compression.
- Lazy loading.
- Code splitting.
- Optimized bundle.
- Debounce search.
- Cache data yang memungkinkan.

---

# 53. Upload Image Optimization

Karena mayoritas user menggunakan HP, foto nota bisa berukuran besar.

Sebelum upload:

```text
Foto Kamera
      ↓
Resize
      ↓
Compress
      ↓
Upload
```

Target:

- Tetap terbaca.
- Ukuran file lebih kecil.
- Tidak membebani storage.

---

# 54. Data Retention

Transaksi yang sudah dihapus secara soft delete tetap tersedia untuk audit.

Tidak boleh ada tombol:

> "Hapus permanen"

untuk user biasa.

Jika suatu saat diperlukan fitur permanent deletion, sebaiknya hanya Admin dengan proteksi tambahan.

---

# 55. Laporan Bulanan

Sistem menggunakan kombinasi:

```text
Tanggal transaksi
+
Bulan
+
Tahun
```

Contoh:

```text
03 September 2026
```

masuk ke:

```text
September 2026
```

---

# 56. Rekap Kategori

Periode:

**September 2026**

misalnya:

```text
ATK             Rp1.500.000
HONORIUM         Rp4.000.000
TRANSPORTASI     Rp1.250.000
PERLENGKAPAN     Rp2.100.000
KONSUMSI           Rp900.000
LAINNYA            Rp300.000
────────────────────────────
TOTAL             Rp10.050.000
```

---

# 57. Data Consistency

Total laporan harus berasal dari transaksi yang:

```text
status != DELETED
```

dan berada pada periode yang dipilih.

Transaksi deleted tidak dihitung dalam:

- Dashboard
- Total
- Grafik
- Excel
- PDF
- CSV

kecuali laporan audit secara khusus menampilkannya.

---

# 58. Pengaturan

Menu:

```text
Pengaturan
├── Profil Saya
├── Ganti Password
├── Kategori
├── Pengguna       ← Admin
├── Preferensi
│   ├── Dark Mode
│   └── ...
└── Tentang Aplikasi
```

---

# 59. Change Password

User dapat mengganti password sendiri.

Form:

```text
Password Lama
[••••••••]

Password Baru
[••••••••]

Konfirmasi Password
[••••••••]

[ Simpan Password ]
```

Validasi:

```text
Password baru ≠ password lama
Password confirmation harus sama
```

---

# 60. Struktur Halaman

## Public

```text
/login
/forgot-password
```

## Protected

```text
/dashboard

/transactions
/transactions/new
/transactions/:id
/transactions/:id/edit

/reports
/reports/monthly
/reports/yearly

/analytics

/categories

/users

/settings
/settings/profile
/settings/password
```

---

# 61. API / Service Layer

Frontend tidak sebaiknya mencampurkan seluruh logic Firebase langsung ke komponen UI.

Struktur:

```text
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
│   ├── auth.service
│   ├── transaction.service
│   ├── category.service
│   ├── user.service
│   ├── report.service
│   └── audit.service
├── utils/
├── constants/
├── types/
└── lib/
    └── firebase
```

Dengan demikian aplikasi lebih mudah dirawat.

---

# 62. Technology Stack

### Frontend

```text
React
Vite
Tailwind CSS
Axios
```

Direkomendasikan tambahan:

```text
React Router
React Hook Form
Zod
Lucide React
```

Untuk state management, V1 dapat menggunakan:

```text
React Context
+
custom hooks
```

dan tidak perlu langsung memakai Redux jika kompleksitas belum membutuhkan.

---

# 63. Export Technology

Excel:

- XLSX

PDF:

- library PDF yang mendukung A4.

CSV:

- native generation / library CSV.

Semua export harus berasal dari data yang sama sehingga:

```text
Dashboard
   ↓
Reports
   ↓
Excel
   ↓
PDF
   ↓
CSV
```

menghasilkan angka yang konsisten.

---

# 64. Acceptance Criteria — Transaction

Transaksi dianggap berhasil apabila:

- Tanggal valid.
- Kategori aktif.
- Nama pengeluaran tersedia.
- Nominal > 0.
- User terautentikasi.
- Data tersimpan di Firestore.
- `createdBy` tersimpan.
- `createdAt` tersimpan.
- Jika ada bukti, file tersimpan di Storage.
- Transaksi muncul di daftar.

---

# 65. Acceptance Criteria — Category

Kategori dianggap berhasil dibuat apabila:

- Nama tidak kosong.
- Nama belum digunakan.
- Status aktif.
- Memiliki ID unik.
- Muncul pada form transaksi.
- Muncul dalam export jika memiliki transaksi.

---

# 66. Acceptance Criteria — Excel

Export Excel harus:

- Menghasilkan satu file.
- Memiliki sheet Ringkasan.
- Memiliki sheet Semua Transaksi.
- Memiliki sheet setiap kategori yang digunakan.
- Menghitung total secara benar.
- Mengikuti periode laporan.
- Memiliki format Rupiah.
- Memiliki header.
- Memiliki total kategori.
- Tidak memasukkan transaksi deleted.
- Kategori baru otomatis menghasilkan sheet baru.
- Tidak perlu perubahan kode ketika kategori baru dibuat.

---

# 67. Acceptance Criteria — Mobile

Pada HP:

- Login nyaman.
- Form transaksi mudah digunakan.
- Tombol cukup besar untuk disentuh.
- Upload kamera dapat digunakan.
- Bottom navigation tersedia.
- Tidak ada horizontal overflow.
- Tabel diganti menjadi card/list ketika diperlukan.
- Semua fungsi utama tersedia.

---

# 68. Acceptance Criteria — Desktop

Pada desktop:

- Sidebar tersedia.
- Dashboard menggunakan grid.
- Transaction menggunakan tabel.
- Filter dapat digunakan.
- Laporan nyaman dibaca.
- Export mudah ditemukan.
- Print layout A4 tersedia.

---

# 69. Security Checklist

Sebelum production:

```text
☐ Firebase Security Rules
☐ Authentication protection
☐ Role validation
☐ Admin privilege protection
☐ Storage Rules
☐ File type validation
☐ File size validation
☐ Input validation
☐ XSS protection
☐ Audit logging
☐ Soft delete
☐ HTTPS
☐ Environment variables
☐ Tidak ada Firebase secret di source code
```

---

# 70. Deployment

Frontend:

**Vercel**

```text
GitHub
   ↓
Vercel
   ↓
Production
```

Firebase:

```text
Firebase Authentication
Firebase Firestore
Firebase Storage
Firebase Functions
```

Environment variable:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Catatan: Firebase client configuration memang dapat terlihat di frontend; keamanan utama tetap harus ditegakkan melalui **Firebase Security Rules**, bukan dengan menyembunyikan config tersebut.

---

# 71. Prioritas Pengembangan

Saya menyarankan pembangunan tidak langsung semuanya sekaligus.

## Phase 1 — Core

**Prioritas P0**

```text
Authentication
      ↓
Dashboard
      ↓
Transaction
      ↓
Category
      ↓
Firestore
      ↓
Audit dasar
```

Target:

> User sudah bisa login dan mencatat pengeluaran.

---

## Phase 2 — Reporting

**Prioritas P0**

```text
Monthly Report
Yearly Report
Filter
Search
Excel
CSV
PDF
Print
```

Target:

> LPNS sudah bisa menghasilkan laporan profesional.

---

## Phase 3 — Security & Administration

**Prioritas P1**

```text
User Management
Role
Audit Log lengkap
Soft Delete
Storage Rules
Advanced Security
```

---

## Phase 4 — UX Enhancement

**Prioritas P1**

```text
Dark Mode
Image compression
Skeleton loading
Advanced filter
Chart
Responsive optimization
```

---

# 72. Future Version

Fitur berikut dapat dipersiapkan dalam arsitektur tetapi tidak wajib V1:

### V1.1

- Restore transaksi deleted
- Dashboard lebih detail
- Export custom
- Filter lanjutan

### V2

- Lock laporan bulanan
- Approval laporan
- Tanda tangan digital
- Riwayat revisi laporan
- Notifikasi
- Reminder laporan

### V3

Jika kebutuhan berkembang:

- Multi-organisasi
- Multi-cabang
- Pemasukan
- Anggaran
- Budget vs actual
- Sistem akuntansi sederhana

---

# 73. Fitur Lock Laporan — Future

Karena laporan keuangan memiliki periode, nantinya dapat dibuat:

```text
September 2026
🟢 TERBUKA

      ↓

Ketua mengunci laporan

      ↓

September 2026
🔒 TERKUNCI
```

Ketika locked:

- Tidak dapat edit.
- Tidak dapat delete.
- Laporan dianggap final.

Namun fitur ini **belum masuk V1**, sehingga struktur database sebaiknya disiapkan agar nantinya mudah ditambahkan.

---

# 74. User Flow Utama

## Login

```text
Buka aplikasi
     ↓
Login
     ↓
Firebase Authentication
     ↓
Valid
     ↓
Dashboard
```

## Tambah transaksi

```text
Dashboard
     ↓
+ Tambah
     ↓
Form
     ↓
Validasi
     ↓
Upload bukti jika ada
     ↓
Firestore
     ↓
Audit Log
     ↓
Success
```

## Laporan

```text
Dashboard
     ↓
Laporan
     ↓
Pilih bulan/tahun
     ↓
Generate
     ↓
Preview
     ↓
Export
```

## Excel

```text
Pilih periode
      ↓
Ambil transaksi
      ↓
Kelompokkan kategori
      ↓
Buat Ringkasan
      ↓
Buat Semua Transaksi
      ↓
Buat Sheet Kategori
      ↓
Format Excel
      ↓
Download
```

---

# 75. Prinsip Penting Produk

Ada beberapa keputusan desain yang menurut saya **harus dipertahankan**:

### 1. Firebase sebagai database utama

Tidak perlu lagi memaksakan Google Spreadsheet sebagai database.

### 2. Kategori dinamis

Kategori bukan hard-code.

```text
categories
```

menjadi sumber kategori aplikasi.

### 3. Kategori tidak dihapus secara permanen

Gunakan:

```text
ACTIVE
INACTIVE
```

agar histori laporan aman.

### 4. Bukti transaksi opsional

Transaksi tetap valid tanpa bukti.

### 5. Soft delete

Data keuangan tidak boleh hilang begitu saja.

### 6. Audit log

Sistem selalu mengetahui:

> siapa membuat, mengubah, dan menghapus.

### 7. Excel satu file

Ini menjadi format export utama:

```text
Laporan LPNS.xlsx

├── Ringkasan
├── Semua Transaksi
├── ATK
├── HONORIUM
├── TRANSPORTASI
├── PERLENGKAPAN
├── KONSUMSI
└── kategori lainnya
```

### 8. Mobile-first

HP adalah **platform utama**, desktop adalah platform pendukung.

---

## 76. Definition of Done V1

V1 dianggap selesai apabila pengguna dapat melakukan seluruh alur berikut:

```text
Admin membuat akun
        ↓
User login
        ↓
Melihat dashboard
        ↓
Tambah pengeluaran
        ↓
Upload bukti (opsional)
        ↓
Data tersimpan
        ↓
Transaksi muncul
        ↓
User dapat mencari/filter
        ↓
User dapat edit
        ↓
Perubahan tercatat
        ↓
User dapat melihat laporan
        ↓
Pilih September 2026
        ↓
Melihat rekap kategori
        ↓
Export Excel
        ↓
        ┌────────────────────┐
        │ Ringkasan          │
        │ Semua Transaksi    │
        │ ATK                │
        │ HONORIUM           │
        │ TRANSPORTASI       │
        │ PERLENGKAPAN       │
        │ KONSUMSI           │
        │ ...                │
        └────────────────────┘
        ↓
Export PDF
        ↓
Print A4
```

**Kesimpulan arsitektur V1:** React + Vite + Tailwind CSS + Axios di frontend, **Firebase Authentication + Firestore + Storage + Functions** sebagai backend, dan **Vercel untuk deployment frontend**. Fokus desainnya **mobile-first**, dengan dashboard desktop yang lebih luas. Kategori dibuat dinamis sehingga laporan Excel dapat otomatis mengikuti kategori yang dibuat Admin.
