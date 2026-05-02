# 🚀 PixlCraft Studio - Panduan Lengkap Hosting (Final Production Ready)

Dokumen ini adalah ringkasan teknis final untuk meluncurkan website PixlCraft Studio ke publik. Pastikan semua langkah di bawah ini sudah diperiksa satu per satu.

---

## 🛠️ Langkah 1: Kesiapan Supabase (Backend)

Sistem PixlCraft menggunakan Supabase sebagai otak website. Pastikan konfigurasi ini sudah sesuai:

1. **SQL Editor:** Pastikan tabel `about`, `hero`, `services`, `portfolio`, dan `testimonials` sudah ada. 
   - **WAJIB:** Jalankan perintah ini di SQL Editor untuk fitur sosmed dinamis:
     ```sql
     ALTER TABLE about ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '[]'::jsonb;
     ```
2. **Storage:**
   - Bucket harus bernama `images`.
   - Centang **Public Bucket**.
   - Masuk ke tab **Policies** dan pilih **"Get started from scratch"** -> Buat Policy bernama `Allow Public Select` -> Pilih SELECT dan set target ke `public`. (Tanpa ini, gambar tidak akan muncul di website publik).
3. **Admin User:**
   - Di menu **Authentication**, pastikan Anda sudah membuat email & password untuk diri Anda sendiri agar bisa masuk ke Dashboard.

---

## 💻 Langkah 2: Audit Kode Lokal (Pre-Deployment)

Sebelum menjalankan `npm run build`, cek file-file berikut:

1. **Ganti Kode Google Search Console:**
   - File: `client/src/pages/public/Home.jsx`
   - Cari: `google-site-verification` (Sekitar baris 250).
   - Ganti `ADD_YOUR_GSC_KEY_HERE` dengan kode asli dari Google Console Anda.
2. **Keamanan URL Admin:**
   - File: `client/.env`
   - Ganti `VITE_ADMIN_PATH=pixl-vault` menjadi kata rahasia Anda sendiri (Contoh: `gerbang-pusat`). URL login Anda nanti akan menjadi `domain.com/gerbang-pusat`.
3. **Robots & Sitemap:**
   - File: `client/public/robots.txt` & `sitemap.xml`.
   - Pastikan Link URL-nya mengarah ke domain asli Anda (misal: `https://pixlcraft.studio`).

---

## 🖼️ Langkah 3: Optimasi Aset (Performance)

Ini yang menentukan apakah skor website Anda Hijau (90+) atau Merah di mata Google:

1. **Kompres Gambar:** Foto portofolio atau Hero yang ukurannya > 1MB akan menghancurkan skor performa. 
   - Masukkan ke [TinyPNG](https://tinypng.com).
   - Gunakan format **.webp** (jika bisa) untuk hasil paling "ngebut".
2. **Favorit Icon:** Ganti file `client/public/myicons/favicon.png` dengan logo PixlCraft versi kecil agar muncul di tab browser.

---

## 📦 Langkah 4: Proses Go Live

### Jika Menggunakan Vercel / Netlify (Sangat Direkomendasikan):
1. Pilih folder `client`.
2. Framework: `Vite`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. **PENTING:** Masukkan isi file `.env` (VITE_SUPABASE_URL, dll) ke menu **Environment Variables** di Dashboard Vercel/Netlify. Tanpa ini, website akan error 404/500.

### Jika Menggunakan cPanel (Hosting Biasa):
1. Jalankan `npm run build` di laptop Anda.
2. Buka folder `client/dist`.
3. Upload **isinya** (bukan foldernya) ke `public_html`.
4. **WAJIB:** Buat file `.htaccess` di dalam `public_html` dan tempel kode ini agar URL "Page Not Found" tidak muncul saat refresh:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## ✅ Langkah 5: Final Check (Quality Assurance)

Begitu website online (Live), tes hal-hal ini:
- [ ] **Data:** Apakah teks nama perusahaan dan portofolio sudah muncul otomatis dari database?
- [ ] **Form Kontak:** Coba kirim pesan palsu. Apakah masuk ke Dashboard Admin bagian Inbox?
- [ ] **Rate Limit:** Coba kirim pesan dua kali berturut-turut. Harus muncul peringatan "Tunggu 1 menit".
- [ ] **Keamanan:** Coba masuk ke folder Admin (`/vault-rahasia`). Pastikan Anda harus login dulu.

---
**CONGRATULATIONS!** PixlCraft Studio sekarang sudah online dengan standar keamanan dan performa kelas atas! 🚀🎨
