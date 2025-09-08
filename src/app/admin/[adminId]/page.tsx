import { eq } from "drizzle-orm";
import { Building, Shield, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/app/db";
import { usersTable } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminDashboardProps {
  params: Promise<{
    adminId: string;
  }>;
}

async function getAdminUser(adminId: string) {
  try {
    const adminIdNum = parseInt(adminId);
    if (isNaN(adminIdNum)) {
      return null;
    }

    const adminUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, adminIdNum))
      .limit(1);

    if (adminUser.length === 0 || !adminUser[0].isActive) {
      return null;
    }

    return adminUser[0];
  } catch (error) {
    console.error("Erro ao buscar administrador:", error);
    return null;
  }
}

export default async function AdminDashboard({ params }: AdminDashboardProps) {
  const { adminId } = await params;
  const adminUser = await getAdminUser(adminId);

  if (!adminUser) {
    notFound();
  }

  return (
    <>
      <div className="md:mx-52">
        {/* Main Content */}
        <div>
          <div className="mt-26 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white">
                Painel Administrativo
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
                Bem-vindo,{" "}
                <strong className="text-blue-400">{adminUser.name}</strong>!
                Área administrativa do Ceará por Temporada. Aqui você pode
                gerenciar contas de administradores e cadastrar imóveis na
                plataforma.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="border-slate-700 bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    Gerenciar Contas
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
                      Ver Contas
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
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
                <Shield className="h-6 w-6 text-blue-400" />
                Informações do Administrador
              </h3>
              <div className="grid grid-cols-1 gap-6 text-lg md:grid-cols-3">
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
                  <p className="font-semibold text-blue-400">{adminUser.id}</p>
                </div>
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
