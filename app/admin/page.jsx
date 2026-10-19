import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createSessionClient, createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];

  try {
    const supabase = await createSessionClient();
    const { data } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (data && data.length > 0) {
      daftarProduk = data;
    } else {
      const serverSupabase = createServerClient();
      const { data: fallbackData } = await serverSupabase
        .from("produk")
        .select("*")
        .order("id", { ascending: true });
      daftarProduk = fallbackData || [];
    }
  } catch {
    try {
      const serverSupabase = createServerClient();
      const { data } = await serverSupabase
        .from("produk")
        .select("*")
        .order("id", { ascending: true });
      daftarProduk = data || [];
    } catch {
      daftarProduk = [];
    }
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {daftarProduk.length > 0 ? (
        <TabelProduk daftarProduk={daftarProduk} />
      ) : (
        <p className="text-teks-lembut">Belum ada produk</p>
      )}
    </div>
  );
}

