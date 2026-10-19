import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormUbahProduk from "@/components/FormUbahProduk";
import { createSessionClient } from "@/lib/supabase/server";

// US-09 (bonus di jalur offline): ubah produk.
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  let produk = null;
  let pesanError = null;

  try {
    const supabase = await createSessionClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      pesanError = error.message;
    } else {
      produk = data;
    }
  } catch (error) {
    pesanError = error.message || "Terjadi kesalahan saat memuat produk.";
  }

  if (!pesanError && !produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      {pesanError ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          <p className="font-semibold">Gagal memuat produk</p>
          <p className="mt-1 text-teks-lembut">{pesanError}</p>
        </div>
      ) : (
        <FormUbahProduk produk={produk} />
      )}
    </div>
  );
}
