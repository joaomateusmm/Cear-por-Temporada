"use client";

import { useEffect } from "react";

import { getOwnerSession } from "@/lib/owner-session";

export default function ProprietarioPage() {
  useEffect(() => {
    const checkSession = () => {
      const session = getOwnerSession();
      if (session) {
        // Redirecionar para o dashboard do proprietário
        window.location.href = `/proprietario/${session.userId}`;
      } else {
        // Redirecionar para o login
        window.location.href = "/proprietario/login";
      }
    };

    checkSession();
  }, []);

  // Componente de loading enquanto verifica a sessão
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
          <p className="text-sm text-slate-300">Verificando acesso...</p>
        </div>
      </div>
    </div>
  );
}
