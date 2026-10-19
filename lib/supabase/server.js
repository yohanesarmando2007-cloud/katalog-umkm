import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getCleanUrl() {
  const rawUrl = process.env.SUPABASE_URL || "";
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

/**
 * Koneksi Supabase untuk server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog dan detail produk) di sisi server.
 */
export function createServerClient() {
  const supabaseUrl = getCleanUrl();
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || "";

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Koneksi sesi admin menggunakan SUPABASE_PUBLISHABLE_KEY + cookie login (@supabase/ssr).
 * Digunakan untuk login, keluar, ganti password, dan aksi tambah/ubah/hapus produk.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  const supabaseUrl = getCleanUrl();
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createSsrServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Method setAll dipanggil dari Server Component (bisa diabaikan jika middleware/proxy memperbarui sesi)
        }
      },
    },
  });
}

export const createClient = createServerClient;
export const createAdminClient = createSessionClient;
export default createServerClient;
