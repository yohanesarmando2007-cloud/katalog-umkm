"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";

export default function FormUbahProduk({ produk }) {
  const action = ubahProduk.bind(null, produk.id);
  const [state, formAction] = useActionState(action, null);

  return (
    <FormProduk
      produk={produk}
      labelTombol="Simpan perubahan"
      action={formAction}
      error={state?.error}
    />
  );
}
