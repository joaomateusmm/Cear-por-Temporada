"use client";

import { useEffect } from "react";

export default function OwnerLoginRedirect() {
  useEffect(() => {
    // Redirecionar para a página de auth com tabs
    window.location.href = "/proprietario/cadastro";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
          <p className="text-sm text-slate-300">Redirecionando...</p>
        </div>
      </div>
    </div>
  );
}
