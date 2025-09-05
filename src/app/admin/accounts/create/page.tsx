"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";

export default function AccountsCreateRedirect() {
  useEffect(() => {
    // Redireciona para a página de login do admin
    window.location.href = "/admin/login";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm text-slate-300">Redirecionando para login...</p>
        </CardContent>
      </Card>
    </div>
  );
}
