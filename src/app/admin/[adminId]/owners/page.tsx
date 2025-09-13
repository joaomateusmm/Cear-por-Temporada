"use client";

import {
  ArrowLeft,
  Trash2,
  UserCheck,
  UserMinus,
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

import { createColumns, type Owner } from "./columns";
import { DataTable } from "./data-table";

interface OwnerPageProps {
  params: Promise<{
    adminId: string;
  }>;
}

export default function OwnersPage({ params }: OwnerPageProps) {
  const { adminId } = use(params);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);

  // Carregar proprietários
  const loadOwners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/owners");
      if (!response.ok) {
        throw new Error("Erro ao carregar proprietários");
      }
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error("Erro ao carregar proprietários:", error);
      toast.error("Erro ao carregar proprietários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  // Calcular estatísticas
  const stats = {
    total: owners.length,
    active: owners.filter((owner) => owner.isActive).length,
    inactive: owners.filter((owner) => !owner.isActive).length,
    withProperties: owners.filter(
      (owner) => (owner._count?.properties || 0) > 0,
    ).length,
  };

  // Manipular seleção de proprietários
  const handleSelectOwner = (ownerId: string, checked: boolean) => {
    setSelectedOwners((prev) =>
      checked ? [...prev, ownerId] : prev.filter((id) => id !== ownerId),
    );
  };

  // Alterar status de um proprietário
  const handleStatusChange = async (ownerId: string, newStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/owners", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle-status",
          ownerId,
          isActive: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar status");
      }

      await loadOwners();
      toast.success(
        `Proprietário ${newStatus ? "ativado" : "desativado"} com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do proprietário");
    }
  };

  // Excluir um proprietário
  const handleDelete = (ownerId: string) => {
    const owner = owners.find((p) => p.id === ownerId);
    if (!owner) return;

    setAlertConfig({
      title: "Excluir Proprietário",
      description: `Tem certeza que deseja excluir o proprietário "${owner.fullName}"? Esta ação não pode ser desfeita.`,
      action: async () => {
        try {
          const response = await fetch("/api/admin/owners", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao excluir proprietário");
          }

          await loadOwners();
          toast.success("Proprietário excluído com sucesso!");
        } catch (error: unknown) {
          console.error("Erro ao excluir proprietário:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao excluir proprietário";
          toast.error(errorMessage);
        }
      },
    });
    setAlertOpen(true);
  };

  // Ações em massa
  const handleBulkDelete = () => {
    if (selectedOwners.length === 0) return;

    setAlertConfig({
      title: "Excluir Proprietários",
      description: `Tem certeza que deseja excluir ${selectedOwners.length} proprietário(s) selecionado(s)? Esta ação não pode ser desfeita.`,
      action: async () => {
        try {
          const response = await fetch("/api/admin/owners", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerIds: selectedOwners }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao excluir proprietários");
          }

          setSelectedOwners([]);
          await loadOwners();
          toast.success(
            `${selectedOwners.length} proprietário(s) excluído(s) com sucesso!`,
          );
        } catch (error: unknown) {
          console.error("Erro ao excluir proprietários:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao excluir proprietários";
          toast.error(errorMessage);
        }
      },
    });
    setAlertOpen(true);
  };

  const handleBulkActivate = async () => {
    if (selectedOwners.length === 0) return;

    try {
      const response = await fetch("/api/admin/owners", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "bulk-toggle-status",
          ownerIds: selectedOwners,
          isActive: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao ativar proprietários");
      }

      setSelectedOwners([]);
      await loadOwners();
      toast.success(
        `${selectedOwners.length} proprietário(s) ativado(s) com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao ativar proprietários:", error);
      toast.error("Erro ao ativar proprietários");
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedOwners.length === 0) return;

    try {
      const response = await fetch("/api/admin/owners", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "bulk-toggle-status",
          ownerIds: selectedOwners,
          isActive: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao desativar proprietários");
      }

      setSelectedOwners([]);
      await loadOwners();
      toast.success(
        `${selectedOwners.length} proprietário(s) desativado(s) com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao desativar proprietários:", error);
      toast.error("Erro ao desativar proprietários");
    }
  };

  // Função para marcar toda a página atual
  const handleSelectPage = (ownerIds: string[]) => {
    setSelectedOwners(ownerIds);
  };

  // Função para marcar todos os proprietários
  const handleSelectAll = (ownerIds: string[]) => {
    setSelectedOwners(ownerIds);
  };

  const columns = createColumns(
    adminId,
    handleStatusChange,
    handleDelete,
    selectedOwners,
    handleSelectOwner,
  );

  if (loading) {
    return (
      <div className="mt-30 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-slate-400"></div>
          <p className="mt-2 text-slate-300">Carregando Proprietários...</p>
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
            Gestão de Proprietários
          </h1>
          <p className="text-slate-300">
            Gerencie todos os proprietários cadastrados na plataforma
          </p>
        </div>

        {/* Layout para desktop */}
        <div className="hidden md:block">
          <h1 className="mb-4 text-2xl font-bold text-slate-100">
            Gestão de Proprietários
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
                Gerencie todos os proprietários cadastrados na plataforma
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total de Proprietários
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

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Com Imóveis
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <UserMinus className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">
              {stats.withProperties}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-slate-700 bg-slate-800">
        <div className="flex flex-col justify-between md:flex-row">
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-slate-100">
              Proprietários Cadastrados
            </CardTitle>
            <CardDescription className="text-center text-slate-400 md:w-50 md:text-left">
              Lista de todos os proprietários cadastrados no sistema com filtros
              avançados
            </CardDescription>
          </CardHeader>
          {/* Barra de ações em massa - APENAS DESKTOP */}
          <div className="hidden md:block">
            {selectedOwners.length > 0 && (
              <Card className="border-none bg-slate-800 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleBulkActivate}
                      size="sm"
                      className="bg-green-900/50 text-green-100"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Ativar ({selectedOwners.length})
                    </Button>
                    <Button
                      onClick={handleBulkDeactivate}
                      size="sm"
                      className="bg-orange-900/50 text-orange-100"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Desativar ({selectedOwners.length})
                    </Button>
                    <Button
                      onClick={handleBulkDelete}
                      size="sm"
                      className="bg-red-900/50 text-red-100"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir ({selectedOwners.length})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Barra de ações em massa - APENAS MOBILE */}
        <div className="md:hidden">
          {selectedOwners.length > 0 && (
            <Card className="mx-6 mb-6 border-none bg-slate-800 shadow-none">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Button
                    onClick={handleBulkActivate}
                    size="sm"
                    className="bg-green-900/50 text-green-100"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Ativar ({selectedOwners.length})
                  </Button>
                  <Button
                    onClick={handleBulkDeactivate}
                    size="sm"
                    className="bg-orange-900/50 text-orange-100"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Desativar ({selectedOwners.length})
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    size="sm"
                    className="bg-red-900/50 text-red-100"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir ({selectedOwners.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <CardContent>
          {owners.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-200">
                Nenhum proprietário encontrado
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Os proprietários cadastrados aparecerão aqui.
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={owners}
              selectedOwners={selectedOwners}
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
