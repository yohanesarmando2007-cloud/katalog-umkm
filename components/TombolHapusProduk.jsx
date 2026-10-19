"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TombolHapusProduk({ id }) {
  const action = hapusProduk.bind(null, id);
  const [state, formAction] = useActionState(action, null);

  function konfirmasiHapus(event) {
    if (!window.confirm("Yakin ingin menghapus?")) {
      event.preventDefault();
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={formAction} onSubmit={konfirmasiHapus}>
        <Tombol type="submit" varian="bahaya">
          Hapus
        </Tombol>
      </form>
      {state?.error && (
        <p role="alert" className="max-w-48 text-right text-xs text-bahaya">
          {state.error}
        </p>
      )}
    </div>
  );
}
