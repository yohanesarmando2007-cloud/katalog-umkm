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

