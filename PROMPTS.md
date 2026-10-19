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
AI membuat Server Actions `login` dan `keluar` di `app/admin/actions.js`, menambahkan penanganan cookie Supabase Auth via `@supabase/ssr` di `lib/supabase/server.js`, menyambungkan form login menggunakan `useActionState` di `app/admin/login/page.jsx`, serta memperbarui fungsi tombol Keluar pada `components/NavAdmin.jsx`. Komponen `CatatanBelumAktif` berhasil dihapus tanpa merusak tampilan.

**Perbaikan:**
Menyesuaikan pesan error autentikasi agar tampil secara intuitif bagi pengguna jika kredensial salah, serta mengonfigurasi pengelolaan sesi cookie `@supabase/ssr` agar proses login dan pengakhiran sesi (*sign out*) bekerja stabil di lingkungan Next.js Server Actions.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
AI menambahkan Server Action `gantiPassword` pada `app/admin/actions.js` dan menyambungkannya ke komponen form di `app/admin/password/page.jsx` menggunakan `useActionState`. Komponen `CatatanBelumAktif` berhasil dihapus tanpa mengubah struktur dan tampilan form.

**Perbaikan:**
Menambahkan validasi *server-side* yang ketat (memeriksa sesi aktif via `supabase.auth.getUser()`, batas minimal 8 karakter, dan kecocokan konfirmasi password) sebelum memperbarui password via `supabase.auth.updateUser()`, serta menampilkan notifikasi pesan sukses hijau atau error merah secara dinamis di halaman.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
AI membuat file `proxy.js` di root proyek menggunakan `@supabase/ssr` untuk memeriksa status autentikasi via `supabase.auth.getUser()`. Pengguna yang belum login otomatis dialihkan ke `/admin/login` jika mencoba mengakses `/admin` atau sub-halamannya. Komponen `CatatanBelumAktif` di `app/admin/page.jsx` juga berhasil dihapus.

**Perbaikan:**
Mengecualikan `/admin/login` dari aturan *redirect* agar tidak terjadi *infinite loop*, serta memastikan Server Action `gantiPassword` di `app/admin/actions.js` tetap memverifikasi autentikasi admin di sisi server sebelum memproses perubahan data.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-07 List Produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-07 dan docs/rancangan-teknis.md.

Ubah app/admin/page.jsx supaya daftar produk yang ditampilkan diambil dari tabel "produk" di Supabase secara server-side, memakai koneksi Supabase yang ada di lib/supabase. Tampilkan seluruh produk lengkap dengan foto, nama, kategori, dan harga berformat rupiah. Jika tabel kosong, tampilkan pesan "Belum ada produk". Hapus komponen CatatanBelumAktif dari halaman ini dan pertahankan tampilan serta struktur layout halaman admin yang sudah ada.

**Hasil:**
AI memperbarui `app/admin/page.jsx` untuk mengambil daftar produk dari tabel `produk` di Supabase secara *server-side* dan mengurutkannya berdasarkan `id`. Seluruh produk dirender menggunakan komponen `TabelProduk` (foto, nama, kategori, harga rupiah, tombol Ubah/Hapus), dan komponen `CatatanBelumAktif` berhasil dihapus.

**Perbaikan:**
Memastikan query diambil secara *server-side* menggunakan koneksi `lib/supabase`, menambahkan kondisi pesan *"Belum ada produk"* saat tabel kosong, serta mempertahankan struktur layout halaman admin (`NavAdmin` dan tombol "Tambah produk").

## US-08 Tambah produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-08 dan docs/rancangan-teknis.md.

Buat Server Action tambah produk di app/admin/actions.js yang menyimpan produk baru (nama, harga, deskripsi, foto_url, kategori) ke tabel "produk" di Supabase, lalu mengalihkan pengguna kembali ke /admin. Sambungkan ke form di app/admin/produk/baru/page.jsx. Pastikan aksi ini terproteksi autentikasi admin di server dan menampilkan pesan error jika simpan gagal. Hapus CatatanBelumAktif dari halaman tersebut dan pertahankan tampilannya.

**Hasil:**
AI membuat Server Action `tambahProduk` di `app/admin/actions.js`, memperbarui `components/FormProduk.jsx` agar mendukung penanganan form Server Action dan notifikasi error, serta menyambungkannya di `app/admin/produk/baru/page.jsx` memakai `useActionState`. Komponen `CatatanBelumAktif` berhasil dihapus tanpa mengubah tampilan layout.

**Perbaikan:**
Menambahkan validasi *server-side* (nama wajib diisi dan harga bernilai positif), memverifikasi autentikasi admin via `supabase.auth.getUser()`, serta melakukan revalidasi cache agar produk yang baru ditambah langsung muncul di halaman admin maupun katalog publik.

## US-09 Ubah produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-09 dan docs/rancangan-teknis.md.

Buat fitur "Ubah produk". Di app/admin/produk/[id]/ubah/page.jsx, ambil data lama produk dari tabel "produk" di Supabase berdasarkan id URL dan isi ke dalam form. Di app/admin/actions.js, buat Server Action `ubahProduk` untuk memperbarui data produk di Supabase lalu arahkan ke /admin. Pastikan aksi terlindungi login admin. Tampilkan pesan error jika pembaruan gagal, dan hapus CatatanBelumAktif tanpa mengubah layout yang ada.

**Hasil:**
Dibuat aksi hapusProduk di app/admin/actions.js. Tombol hapus pada tabel admin disambungkan dengan konfirmasi JavaScript/Client Component untuk memanggil Server Action tersebut dan menghapus data.

**Perbaikan:**
Memastikan pemanggilan fungsi delete aman (protected) di sisi server dan daftar produk (cache) dimuat ulang (revalidatePath) setelah penghapusan berhasil.