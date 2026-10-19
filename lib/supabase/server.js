import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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

export const createClient = createServerClient;
export default createServerClient;

