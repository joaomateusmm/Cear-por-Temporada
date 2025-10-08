"use client";

import {
  ArrowLeft,
  BadgeCheck,
  BadgeDollarSign,
  Hourglass,
  LayoutGrid,
  Plus,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
import { getAdminUser, getPropertiesByAdmin } from "@/lib/property-actions";

import { createColumns, Property } from "./columns";
import { DataTable } from "./data-table";

interface PropertiesPageProps {
  params: Promise<{
    adminId: string;
  }>;
}

export default function PropertiesPage({ params }: PropertiesPageProps) {
  const [adminId, setAdminId] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [adminUser, setAdminUser] = useState<{
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  } | null>(null);

  // Estados para controlar AlertDialogs
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params;
        const { adminId: id } = resolvedParams;
        setAdminId(id);

        // Verificar se o admin existe e está ativo
        const user = await getAdminUser(id);
        if (!user) {
          window.location.href = `/admin/${id}/not-found`;
          return;
        }
        setAdminUser(user);

        // Carregar propriedades
        const propertiesData = await getPropertiesByAdmin(id);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params]);

  const handleStatusChange = async (
    propertyId: string,
    newStatus: "ativo" | "pendente",
  ) => {
    try {
      const response = await fetch(
        `/api/admin/properties/${propertyId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      // Recarregar a lista de propriedades
      const propertiesData = await getPropertiesByAdmin(adminId);
      setProperties(propertiesData);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status do imóvel");
    }
  };

  // Função para seleção de propriedades individual
  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties((prev) => [...prev, propertyId]);
    } else {
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  // Função para excluir imóvel individual
  const handleDeleteProperty = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowSingleDeleteDialog(true);
  };

  // Função que efetivamente exclui o imóvel individual
  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return;

    try {
      const response = await fetch(
        `/api/admin/properties/${propertyToDelete}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Status:", response.status, "Response:", errorText);
        throw new Error(
          `Erro ao excluir imóvel: ${response.status} - ${errorText}`,
        );
      }

      // Recarregar a lista
      const propertiesData = await getPropertiesByAdmin(adminId);
      setProperties(propertiesData);

      // Remover da seleção se estiver selecionado
      setSelectedProperties((prev) =>
        prev.filter((id) => id !== propertyToDelete),
      );
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      alert(
        `Erro ao excluir imóvel: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    } finally {
      setShowSingleDeleteDialog(false);
      setPropertyToDelete(null);
    }
  };

  // Ações em massa
  const handleBulkAction = async (action: "ativo" | "pendente" | "delete") => {
    if (selectedProperties.length === 0) {
      alert("Selecione pelo menos um imóvel");
      return;
    }

    if (action === "delete") {
      setShowBulkDeleteDialog(true);
      return;
    }

    try {
      for (const propertyId of selectedProperties) {
        await fetch(`/api/admin/properties/${propertyId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: action }),
        });
      }

      // Recarregar a lista
      const propertiesData = await getPropertiesByAdmin(adminId);
      setProperties(propertiesData);
      setSelectedProperties([]);
    } catch (error) {
      console.error("Erro na ação em massa:", error);
      alert("Erro ao executar ação em massa");
    }
  };

  // Função que efetivamente exclui os imóveis em massa
  const confirmBulkDelete = async () => {
    try {
      const failedDeletions: string[] = [];

      for (const propertyId of selectedProperties) {
        try {
          const response = await fetch(`/api/admin/properties/${propertyId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Erro ao excluir imóvel ${propertyId}:`,
              response.status,
              errorText,
            );
            failedDeletions.push(propertyId);
          }
        } catch (error) {
          console.error(`Erro ao excluir imóvel ${propertyId}:`, error);
          failedDeletions.push(propertyId);
        }
      }

      if (failedDeletions.length > 0) {
        alert(
          `Alguns imóveis não puderam ser excluídos: ${failedDeletions.length} de ${selectedProperties.length}`,
        );
      }

      // Recarregar a lista
      const propertiesData = await getPropertiesByAdmin(adminId);
      setProperties(propertiesData);
      setSelectedProperties([]);
    } catch (error) {
      console.error("Erro na ação em massa:", error);
      alert("Erro ao executar ação em massa");
    } finally {
      setShowBulkDeleteDialog(false);
    }
  };

  // Função para marcar toda a página atual
  const handleSelectPage = (propertyIds: string[]) => {
    setSelectedProperties(propertyIds);
  };

  // Função para marcar todos os imóveis
  const handleSelectAll = (propertyIds: string[]) => {
    setSelectedProperties(propertyIds);
  };

  // Criar as colunas da tabela
  const columns = createColumns(
    adminId,
    handleStatusChange,
    handleDeleteProperty,
    selectedProperties,
    handleSelectProperty,
  );

  if (isLoading) {
    return (
      <div className="mt-30 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-slate-400"></div>
          <p className="mt-2 text-slate-300">Carregando Propriedades...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null; // Será redirecionado
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
            Gestão de Imóveis
          </h1>
          <p className="text-slate-300">
            Gerencie todos os imóveis cadastrados na plataforma
          </p>
        </div>

        {/* Layout para desktop */}
        <div className="hidden md:block">
          <h1 className="mb-4 text-2xl font-bold text-slate-100">
            Gestão de Imóveis
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
                Gerencie todos os imóveis cadastrados na plataforma
              </p>
            </div>
            {/* <div className="flex justify-end">
              <Link href={`/admin/${adminId}/properties/add`}>
                <Button
                  variant="outline"
                  className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
                  <Plus className="mr-2 h-4 w-4 text-gray-300" />
                  Adicionar Imóvel
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total de Imóveis
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <LayoutGrid className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">
              {properties.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium text-slate-300">
              Ativos
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <BadgeCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-200">
              {properties.filter((p) => p.status === "ativo").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium text-slate-300">
              Pendentes
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <Hourglass className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-200">
              {properties.filter((p) => p.status === "pendente").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Valor Médio/Diária
            </CardTitle>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/50 text-center text-slate-300 duration-300 hover:scale-105">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">
              {properties.length > 0
                ? (
                    properties
                      .filter((p) => p.dailyRate)
                      .reduce((sum, p) => sum + Number(p.dailyRate || 0), 0) /
                    properties.filter((p) => p.dailyRate).length
                  ).toFixed(0)
                : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-slate-700 bg-slate-800">
        <div className="flex flex-col justify-between md:flex-row">
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-slate-100">
              Imóveis Cadastrados
            </CardTitle>
            <CardDescription className="text-center text-slate-400 md:w-50 md:text-left">
              Lista de todos os imóveis cadastrados no sistema com filtros
              avançados
            </CardDescription>
          </CardHeader>
          {/* Botão Adicionar Imóvel - APENAS MOBILE */}
          <div className="flex justify-center px-6 md:hidden">
            <Link href={`/admin/${adminId}/properties/add`}>
              <Button
                variant="outline"
                className="mt-4 -mb-5 border-slate-600 bg-slate-800 px-8 py-5 text-slate-300 hover:bg-slate-700 hover:text-slate-100 hover:active:scale-95"
              >
                <Plus className="mr-2 h-4 w-4 text-gray-300" />
                Adicionar Imóvel
              </Button>
            </Link>
          </div>
          {/* Barra de ações em massa - APENAS DESKTOP */}
          <div className="hidden md:block">
            {selectedProperties.length > 0 && (
              <Card className="border-none bg-slate-800 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-end gap-2">
                    <span className="mr-3 text-slate-300">
                      {selectedProperties.length} imóvel(is) selecionado(s)
                    </span>
                    <Button
                      onClick={() => handleBulkAction("ativo")}
                      size="sm"
                      className="bg-green-900/50 whitespace-nowrap text-green-100 hover:bg-green-900/80"
                    >
                      <BadgeCheck className="mr-1 h-3 w-3" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("pendente")}
                      size="sm"
                      className="bg-yellow-900/50 whitespace-nowrap text-yellow-100 hover:bg-yellow-900/80"
                    >
                      <Hourglass className="mr-1 h-3 w-3" />
                      Tornar Pendente
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("delete")}
                      size="sm"
                      className="bg-red-900/50 whitespace-nowrap text-red-100 hover:bg-red-900/80"
                    >
                      <Trash className="mr-1 h-3 w-3" />
                      Excluir
                    </Button>
                    <Button
                      onClick={() => setSelectedProperties([])}
                      size="sm"
                      className="bg-slate-600/60 whitespace-nowrap text-slate-200 hover:bg-slate-600/90"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Barra de ações em massa - APENAS MOBILE */}
        <div className="md:hidden">
          {selectedProperties.length > 0 && (
            <Card className="mx-6 mb-6 border-none bg-slate-800 shadow-none">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <span className="mr-3 text-center text-slate-300">
                      {selectedProperties.length} imóvel(is) selecionado(s)
                    </span>
                    <Button
                      onClick={() => handleBulkAction("ativo")}
                      size="sm"
                      className="bg-green-900/50 whitespace-nowrap text-green-100 hover:bg-green-900/80"
                    >
                      <BadgeCheck className="mr-1 h-3 w-3" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("pendente")}
                      size="sm"
                      className="bg-yellow-900/50 whitespace-nowrap text-yellow-100 hover:bg-yellow-900/80"
                    >
                      <Hourglass className="mr-1 h-3 w-3" />
                      Tornar Pendente
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("delete")}
                      size="sm"
                      className="bg-red-900/50 whitespace-nowrap text-red-100 hover:bg-red-900/80"
                    >
                      <Trash className="mr-1 h-3 w-3" />
                      Excluir
                    </Button>
                    <Button
                      onClick={() => setSelectedProperties([])}
                      size="sm"
                      className="bg-slate-600/60 whitespace-nowrap text-slate-200 hover:bg-slate-600/90"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <CardContent>
          {properties.length === 0 ? (
            <div className="py-8 text-center">
              <Plus className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-200">
                Nenhum imóvel encontrado
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Comece adicionando seu primeiro imóvel à plataforma.
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={properties}
              selectedProperties={selectedProperties}
              onSelectPage={handleSelectPage}
              onSelectAll={handleSelectAll}
            />
          )}
        </CardContent>
      </Card>

      {/* AlertDialog para exclusão individual */}
      <div>
        <AlertDialog
          open={showSingleDeleteDialog}
          onOpenChange={setShowSingleDeleteDialog}
        >
          <AlertDialogContent className="mx-auto w-[350px] border-slate-700 bg-slate-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-100">
                Excluir Imóvel
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300">
                Tem certeza que deseja excluir este imóvel? Esta ação não pode
                ser desfeita e removerá permanentemente o imóvel da plataforma.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="w-full">
              <AlertDialogFooter>
                <AlertDialogCancel className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteProperty}
                  className="bg-red-800/70 text-white hover:bg-red-800"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* AlertDialog para exclusão em massa */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent className="mx-auto w-[350px] border-slate-700 bg-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">
              Excluir {selectedProperties.length} Imóveis
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Tem certeza que deseja excluir {selectedProperties.length} imóveis
              selecionados? Esta ação não pode ser desfeita e removerá
              permanentemente todos os imóveis selecionados da plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-300">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-800/70 text-white hover:bg-red-800"
            >
              Excluir Todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
