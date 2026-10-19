"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email")?.toString().trim();
  const password = data?.get?.("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        error:
          error.message === "Invalid login credentials"
            ? "Email atau password salah."
            : error.message || "Gagal masuk. Periksa kembali data login Anda.",
      };
    }
  } catch {
    return { error: "Terjadi kesalahan saat menghubungi server autentikasi." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Tetap lanjutkan pengalihan meskipun sesi sudah tidak aktif
  }

  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export const logout = keluar;

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const passwordBaru = data?.get?.("password_baru")?.toString() || "";
  const konfirmasiPassword = data?.get?.("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      return { error: error.message || "Gagal mengganti password." };
    }

    return { success: true, message: "Password berhasil diganti." };
  } catch {
    return { error: "Terjadi kesalahan saat mengganti password." };
  }
}

export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const nama = data?.get?.("nama")?.toString().trim();
  const hargaStr = data?.get?.("harga")?.toString().trim();
  const kategori = data?.get?.("kategori")?.toString().trim() || null;
  const foto_url = data?.get?.("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get?.("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaStr, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka dan tidak boleh negatif." };
  }

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali.",
      };
    }

    const { error: insertError } = await supabase.from("produk").insert({
      nama,
      harga,
      deskripsi,
      foto_url,
      kategori,
    });

    if (insertError) {
      return {
        error: insertError.message || "Gagal menyimpan produk ke database.",
      };
    }
  } catch {
    return { error: "Terjadi kesalahan saat menyimpan produk." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export const createProduct = tambahProduk;

export async function ubahProduk(id, prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const nama = data?.get?.("nama")?.toString().trim();
  const hargaStr = data?.get?.("harga")?.toString().trim();
  const kategori = data?.get?.("kategori")?.toString().trim() || null;
  const foto_url = data?.get?.("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get?.("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaStr, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka dan tidak boleh negatif." };
  }

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali.",
      };
    }

    const { data: produk, error: updateError } = await supabase
      .from("produk")
      .update({ nama, harga, deskripsi, foto_url, kategori })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (updateError) {
      return {
        error: updateError.message || "Gagal memperbarui produk di database.",
      };
    }

    if (!produk) {
      return { error: "Produk tidak ditemukan atau tidak dapat diperbarui." };
    }
  } catch {
    return { error: "Terjadi kesalahan saat memperbarui produk." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function hapusProduk(id) {
  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali.",
      };
    }

    const { data: produk, error: deleteError } = await supabase
      .from("produk")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      return {
        error: deleteError.message || "Gagal menghapus produk dari database.",
      };
    }

    if (!produk) {
      return { error: "Produk tidak ditemukan atau tidak dapat dihapus." };
    }
  } catch {
    return { error: "Terjadi kesalahan saat menghapus produk." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}
