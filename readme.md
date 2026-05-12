# 📚 BIKINBUKUYUK - Ebook Creator & Library

**BIKINBUKUYUK** adalah aplikasi web berbasis cloud yang dirancang khusus untuk mempermudah penulis, akademisi, dan profesional di Indonesia dalam menyusun naskah buku menjadi format Ebook PDF yang profesional dan rapi secara instan.

---

## ✨ Fitur Utama
* **Editor Interaktif:** Dashboard penulisan yang rapi untuk menyusun Judul, Subtitle, Prolog, Bab, hingga Epilog.
* **Custom Styling:** Pengaturan ukuran font khusus untuk Judul Cover, Judul Bab, dan Isi Teks.
* **Cloud Sync (Firebase):** Simpan naskah secara aman di cloud. Mas bisa melanjutkan tulisan kapan saja dan dari perangkat mana saja.
* **Sistem Nama Pena:** Fitur Username Publik untuk menjaga privasi penulis tanpa menampilkan email di halaman perpustakaan.
* **Preview PDF Instan:** Hasilkan dokumen PDF ukuran A4 dengan penomoran halaman otomatis dan batas halaman visual (*Page Break*).
* **Library Publik:** Daftar buku yang sudah dipublikasikan dapat dilihat dan dibaca langsung melalui halaman utama.

---

## 🛠️ Teknologi yang Digunakan
* **Frontend:** HTML5, CSS3 (Modern UI/UX), JavaScript (Vanilla).
* **Backend & Database:** Firebase Auth (Login Google) & Firestore Cloud Database.
* **PDF Engine:** [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) untuk konversi dokumen berkualitas tinggi.

---

## 🚀 Cara Menjalankan Proyek
1.  **Clone atau Download** repository ini.
2.  Karena menggunakan Firebase, Mas perlu memastikan domain GitHub Pages Mas (contoh: `username.github.io`) sudah didaftarkan di **Firebase Console > Authentication > Settings > Authorized Domains**.
3.  Buka file `index.html` melalui browser atau jalankan lewat *Live Server* di VS Code.
4.  Login menggunakan akun Google untuk mulai membuat buku di **Editor Dashboard**.

---

## 📂 Struktur Folder
* `index.html` : Halaman utama / Perpustakaan buku.
* `admin.html` : Halaman login administrator/penulis.
* `editor.html` : Dashboard penulisan dan pengaturan buku.
* `css/` : Berisi file styling (`style.css` & `admin.css`).
* `js/` : Berisi logika aplikasi (`home.js`, `editor.js`, `auth.js`).

---

## 📝 Catatan Privasi
Aplikasi ini mendukung **Username Publik**. Penulis dapat memilih nama tampilan mereka sendiri yang akan muncul di dropdown Perpustakaan, sehingga alamat email tetap terjaga kerahasiaannya.

---

**Dibuat dengan ❤️ untuk Penulis Indonesia.**