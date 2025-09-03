import { AlertTriangle, Shield } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Acesso Negado</CardTitle>
          <CardDescription>
            O ID do administrador não foi encontrado ou a conta está inativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-800">Área Protegida</h4>
                <p className="mt-1 text-sm text-red-700">
                  Esta área é restrita a administradores autorizados com contas
                  ativas. Verifique se:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-red-700">
                  <li>• O ID do administrador está correto</li>
                  <li>• A conta está ativa no sistema</li>
                  <li>• Você tem permissão para acessar esta área</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/admin/login">
              <Button className="w-full">Fazer Login</Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Para suporte, entre em contato com a equipe técnica
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
