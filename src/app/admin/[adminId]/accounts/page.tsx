"use client";

import {
  ArrowLeft,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllAdminUsers, toggleUserStatus } from "@/lib/admin-actions";

import { type AdminUser, createColumns } from "./columns";
import { DataTable } from "./data-table";

interface AdminAccountsPageProps {
  params: Promise<{
    adminId: string;
  }>;
}

export default function AdminAccountsPage({ params }: AdminAccountsPageProps) {
  const { adminId } = use(params);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);

  // Carregar administradores
  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllAdminUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Erro ao carregar administradores:", error);
      toast.error("Erro ao carregar administradores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Calcular estatísticas
  const stats = {
    total: users.length,
    active: users.filter((user) => user.isActive).length,
    inactive: users.filter((user) => !user.isActive).length,
  };

  // Manipular seleção de administradores
  const handleSelectUser = (userId: number, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  };

  // Alterar status de um administrador
  const handleStatusChange = async (userId: number, newStatus: boolean) => {
    try {
      await toggleUserStatus(userId, newStatus);
      await loadUsers();
      toast.success(
        `Administrador ${newStatus ? "ativado" : "desativado"} com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do administrador");
    }
  };

  // Excluir um administrador
  const handleDelete = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setAlertConfig({
      title: "Excluir Administrador",
      description: `Tem certeza que deseja excluir o administrador "${user.name}"? Esta ação não pode ser desfeita.`,
      action: async () => {
        try {
          // Aqui você implementaria a função de exclusão na lib/admin-actions.ts
          await loadUsers();
          toast.success("Administrador excluído com sucesso!");
        } catch (error: unknown) {
          console.error("Erro ao excluir administrador:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao excluir administrador";
          toast.error(errorMessage);
        }
      },
    });
    setAlertOpen(true);
  };

  // Ações em massa
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;

    setAlertConfig({
      title: "Excluir Administradores",
      description: `Tem certeza que deseja excluir ${selectedUsers.length} administrador(es) selecionado(s)? Esta ação não pode ser desfeita.`,
      action: async () => {
        try {
          // Implementar exclusão em massa
          setSelectedUsers([]);
          await loadUsers();
          toast.success(
            `${selectedUsers.length} administrador(es) excluído(s) com sucesso!`,
          );
        } catch (error: unknown) {
          console.error("Erro ao excluir administradores:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao excluir administradores";
          toast.error(errorMessage);
        }
      },
    });
    setAlertOpen(true);
  };

  const handleBulkActivate = async () => {
    if (selectedUsers.length === 0) return;

    try {
      // Implementar ativação em massa
      for (const userId of selectedUsers) {
        await toggleUserStatus(userId, true);
      }

      setSelectedUsers([]);
      await loadUsers();
      toast.success(
        `${selectedUsers.length} administrador(es) ativado(s) com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao ativar administradores:", error);
      toast.error("Erro ao ativar administradores");
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedUsers.length === 0) return;

    try {
      // Implementar desativação em massa
      for (const userId of selectedUsers) {
        await toggleUserStatus(userId, false);
      }

      setSelectedUsers([]);
      await loadUsers();
      toast.success(
        `${selectedUsers.length} administrador(es) desativado(s) com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao desativar administradores:", error);
      toast.error("Erro ao desativar administradores");
    }
  };

  // Função para marcar toda a página atual
  const handleSelectPage = (userIds: number[]) => {
    setSelectedUsers(userIds);
  };

  // Função para marcar todos os administradores
  const handleSelectAll = (userIds: number[]) => {
    setSelectedUsers(userIds);
  };

  const columns = createColumns(
    handleStatusChange,
    handleDelete,
    selectedUsers,
    handleSelectUser,
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-slate-400">Carregando administradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 space-y-6 md:mx-52">
      {/* Header da página */}
      <div className="">
        {/* Layout para mobile */}
        <div className="block md:hidden">
          <Link href={`/admin/${adminId}`} className="mb-4 inline-block">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="mb-4 text-2xl font-bold text-slate-100">
            Gestão de Administradores
          </h1>
          <p className="text-slate-300">
            Gerencie todos os administradores cadastrados na plataforma
          </p>
        </div>

        {/* Layout para desktop */}
        <div className="hidden md:block">
          <h1 className="mb-4 text-2xl font-bold text-slate-100">
            Gestão de Administradores
          </h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-8">
              <Link href={`/admin/${adminId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <p className="text-slate-300">
                Gerencie todos os administradores cadastrados na plataforma
              </p>
            </div>
            <Link href={`/admin/${adminId}/accounts/create`}>
              <Button className="border-slate-600 bg-blue-600 text-white hover:bg-blue-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Nova Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total de Administradores
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium text-slate-300">
              Ativos
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-200">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium text-slate-300">
              Inativos
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <UserX className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-200">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-slate-700 bg-slate-800">
        <div className="flex flex-col justify-between md:flex-row">
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-slate-100">
              Administradores Cadastrados
            </CardTitle>
            <CardDescription className="text-center text-slate-400 md:w-50 md:text-left">
              Lista de todos os administradores cadastrados no sistema com
              filtros avançados
            </CardDescription>
          </CardHeader>
          {/* Barra de ações em massa - APENAS DESKTOP */}
          <div className="hidden md:block">
            {selectedUsers.length > 0 && (
              <Card className="border-none bg-slate-800 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleBulkActivate}
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-400 hover:bg-green-600/10"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Ativar ({selectedUsers.length})
                    </Button>
                    <Button
                      onClick={handleBulkDeactivate}
                      variant="outline"
                      size="sm"
                      className="border-orange-600 text-orange-400 hover:bg-orange-600/10"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Desativar ({selectedUsers.length})
                    </Button>
                    <Button
                      onClick={handleBulkDelete}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir ({selectedUsers.length})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Barra de ações em massa - APENAS MOBILE */}
        <div className="md:hidden">
          {selectedUsers.length > 0 && (
            <Card className="mx-6 mb-6 border-none bg-slate-800 shadow-none">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Button
                    onClick={handleBulkActivate}
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-400 hover:bg-green-600/10"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Ativar ({selectedUsers.length})
                  </Button>
                  <Button
                    onClick={handleBulkDeactivate}
                    variant="outline"
                    size="sm"
                    className="border-orange-600 text-orange-400 hover:bg-orange-600/10"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Desativar ({selectedUsers.length})
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir ({selectedUsers.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <CardContent>
          {users.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-200">
                Nenhum administrador encontrado
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Os administradores cadastrados aparecerão aqui.
              </p>
              <div className="mt-6">
                <Link href={`/admin/${adminId}/accounts/create`}>
                  <Button className="border-slate-600 bg-blue-600 text-white hover:bg-blue-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Primeira Conta
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              selectedUsers={selectedUsers}
              onSelectPage={handleSelectPage}
              onSelectAll={handleSelectAll}
            />
          )}
        </CardContent>
      </Card>

      {/* AlertDialog para confirmações */}
      <div>
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent className="mx-auto w-[350px] border-slate-700 bg-slate-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-100">
                {alertConfig?.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300">
                {alertConfig?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="w-full">
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setAlertOpen(false)}
                  className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300"
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    alertConfig?.action();
                    setAlertOpen(false);
                  }}
                  className="bg-red-800/70 text-white hover:bg-red-800"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
