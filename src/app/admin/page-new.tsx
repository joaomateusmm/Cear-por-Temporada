import { Building, LogIn, Shield, UserPlus, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Painel Administrativo
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Bem-vindo à área administrativa do Ceará por Temporada. Aqui você pode
          gerenciar contas de administradores e cadastrar imóveis na plataforma.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-blue-600" />
              Login Administrativo
            </CardTitle>
            <CardDescription>
              Faça login para acessar o painel de gerenciamento de imóveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/login">
              <Button className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Gerenciar Contas
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todas as contas administrativas existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/accounts">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Ver Contas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="opacity-60 transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              Cadastrar Imóvel
            </CardTitle>
            <CardDescription>
              Adicione novos imóveis à plataforma (em breve)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Building className="mr-2 h-4 w-4" />
              Em Breve
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conta de Teste */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
          <UserPlus className="h-5 w-5" />
          Conta de Teste Criada
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="font-medium text-blue-800">📧 Email:</p>
            <p className="text-blue-700">test1@gmail.com</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">🔑 Senha:</p>
            <p className="text-blue-700">13IAmb13</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-600">
          Use essas credenciais para testar o sistema de login administrativo.
        </p>
      </div>

      {/* Footer Info */}
      <div className="rounded-lg bg-gray-100 p-6 text-center">
        <h3 className="mb-2 font-semibold text-gray-900">
          Área Administrativa - Ceará por Temporada
        </h3>
        <p className="text-sm text-gray-600">
          Sistema de gerenciamento para plataforma de imóveis por temporada.
          Para suporte técnico, entre em contato com a equipe de
          desenvolvimento.
        </p>
      </div>
    </div>
  );
}
