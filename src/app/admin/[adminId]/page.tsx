"use client";

import { Building, LogOut, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clearAdminSession, getAdminSession } from "@/lib/admin-session";

interface AdminDashboardProps {
  params: Promise<{
    adminId: string;
  }>;
}

export default function AdminDashboard({ params }: AdminDashboardProps) {
  const { adminId } = use(params);
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadAdmin() {
      try {
        // Verifica primeiro se há uma sessão válida
        const session = getAdminSession();
        if (!session || session.userId.toString() !== adminId) {
          router.push("/admin/login");
          return;
        }

        // Se a sessão é válida, usa os dados da sessão
        setAdminUser({
          id: session.userId,
          name: session.userName,
          email: session.userEmail,
          isActive: true,
        });
      } catch (error) {
        console.error("Erro ao carregar admin:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, [adminId, router]);

  // Função de logout
  const handleLogout = () => {
    setLoggingOut(true);

    // Limpar a sessão administrativa
    clearAdminSession();

    toast.success("Logout realizado com sucesso!");
    setTimeout(() => {
      router.push("/admin/login");
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-slate-400"></div>
          <p className="mt-2 text-slate-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <>
      <div className="md:mx-52">
        {/* Main Content */}
        <div>
          <div className="mt-26 space-y-8 px-2 py-8 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 flex h-20 w-50 items-center justify-center">
                <Image
                  src="/logo-alternativa.svg"
                  alt="Logo Ceará por Temporada"
                  width={250}
                  height={250}
                />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white">
                Painel Administrativo
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
                Bem-vindo,{" "}
                <strong className="text-[#16ADE0]">{adminUser.name}</strong>!
                Área administrativa do Ceará por Temporada. Aqui você pode
                gerenciar contas de administradores e cadastrar imóveis na
                plataforma.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="border-slate-700 bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    Gerenciar Admins
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Visualize e gerencie todas as contas administrativas
                    existentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/admin/${adminId}/accounts`}>
                    <Button
                      variant="outline"
                      className="h-12 w-full border-slate-600 bg-slate-700 text-white hover:bg-slate-700/70 hover:text-white"
                    >
                      <Users className="text-muted-foreground-400 mr-2 h-5 w-5" />
                      Ver Admins
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    Gerenciar Proprietários
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Visualize e gerencie todos os proprietários cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/admin/${adminId}/owners`}>
                    <Button
                      variant="outline"
                      className="h-12 w-full border-slate-600 bg-slate-700 text-white hover:bg-slate-700/70 hover:text-white"
                    >
                      <Users className="text-muted-foreground-400 mr-2 h-5 w-5" />
                      Ver Proprietários
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    Gerenciar Imóveis
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Adicione, edite ou exclua novos imóveis à plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/admin/${adminId}/properties`}>
                    <Button
                      variant="outline"
                      className="h-12 w-full border-slate-600 bg-slate-700 text-white hover:bg-slate-700/70 hover:text-white"
                    >
                      <Building className="text-muted-foreground-400 mr-2 h-5 w-5" />
                      Ver Imóveis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Admin Info */}
            <div className="rounded-lg border border-slate-600 bg-slate-800 p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-white">
                Informações do Administrador
              </h3>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="font-medium text-slate-400">Nome:</p>
                  <p className="font-semibold text-white">{adminUser.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-slate-400">Email:</p>
                  <p className="font-semibold text-white">{adminUser.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-slate-400">ID:</p>
                  <p className="font-semibold text-white">{adminUser.id}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="bg-slate-900 duration-300 hover:scale-[1.03] hover:bg-slate-900 disabled:opacity-50"
                >
                  <LogOut />
                  {loggingOut ? "Saindo..." : "Sair"}
                </Button>
              </div>
              <div className="mt-6 rounded-lg border border-slate-600 bg-slate-700/50 p-4">
                <p className="text-slate-300">
                  <span className="inline-flex items-center gap-2 font-medium text-blue-400">
                    Sessão Segura
                  </span>
                  <br />
                  Esta sessão está protegida por ID único. Mantenha a URL
                  segura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
