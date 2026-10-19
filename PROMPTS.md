# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini."

**Hasil:**
AI membuatkan helper koneksi Supabase di lib/supabase/server.js dan lib/supabase/index.js, lalu memperbarui app/page.jsx untuk mengambil data produk dari Supabase. Komponen CatatanBelumAktif berhasil dihapus dan daftar produk tampil menggunakan komponen KartuProduk.

**Perbaikan:**
Memperbaiki penanganan SUPABASE_URL dengan menambahkan fungsi pembersihan URL (menghapus akhiran /rest/v1/) agar koneksi query Supabase tidak timeout atau error, serta menambahkan tampilan pesan error yang jelas dan status "Belum ada produk" saat tabel kosong.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
AI memperbarui `app/produk/[id]/page.jsx` untuk mengambil data satu produk dari Supabase secara *server-side* berdasarkan parameter `id`. Komponen `CatatanBelumAktif` berhasil dihapus, layout tampilan detail produk dan tombol WhatsApp tetap dipertahankan.

**Perbaikan:**
Menambahkan penanganan parameter `params` secara *asynchronous* (`await params`) sesuai standar Next.js versi baru, serta memastikan panggilan `notFound()` berjalan baik jika produk tidak ada di database atau jika ID bernilai tidak valid (non-numerik).

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
AI mengubah `components/TombolWhatsApp.jsx` dari tombol biasa menjadi tautan `<a>` yang mengarah ke `https://wa.me/` menggunakan nomor dari `lib/toko.js`. Tampilan tombol tetap dipertahankan, dan draf pesan disusun otomatis mencakup nama serta harga produk berformat rupiah.

**Perbaikan:**
Memastikan harga di-format menggunakan `formatRupiah` dari `lib/format.js` sebelum di-encode dengan `encodeURIComponent`, serta menambahkan atribut `target="_blank"` dan `rel="noopener noreferrer"` agar tautan aman saat dibuka di tab baru.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**


**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
