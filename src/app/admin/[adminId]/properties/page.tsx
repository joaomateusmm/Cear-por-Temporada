"use client";

import {
  ArrowLeft,
  Check,
  Edit,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminUser, getPropertiesByAdmin } from "@/lib/property-actions";

interface PropertiesPageProps {
  params: Promise<{
    adminId: string;
  }>;
}

type Property = {
  id: string;
  title: string;
  shortDescription: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  createdAt: Date;
  dailyRate: string | null;
  monthlyRent: string | null;
  fullAddress: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
};

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

  // Funções para seleção em massa
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(properties.map((p) => p.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties((prev) => [...prev, propertyId]);
    } else {
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  // Função para excluir imóvel individual
  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir imóvel");
      }

      // Recarregar a lista
      const propertiesData = await getPropertiesByAdmin(adminId);
      setProperties(propertiesData);

      // Remover da seleção se estiver selecionado
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      alert("Erro ao excluir imóvel");
    }
  };

  // Ações em massa
  const handleBulkAction = async (action: "ativo" | "pendente" | "delete") => {
    if (selectedProperties.length === 0) {
      alert("Selecione pelo menos um imóvel");
      return;
    }

    if (action === "delete") {
      if (
        !confirm(
          `Tem certeza que deseja excluir ${selectedProperties.length} imóveis?`,
        )
      )
        return;
    }

    try {
      for (const propertyId of selectedProperties) {
        if (action === "delete") {
          await fetch(`/api/properties/${propertyId}`, {
            method: "DELETE",
          });
        } else {
          await fetch(`/api/admin/properties/${propertyId}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: action }),
          });
        }
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

  if (isLoading) {
    return (
      <div className="mt-30 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-slate-400"></div>
          <p className="mt-2 text-slate-300">Carregando propriedades...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null; // Será redirecionado
  }

  return (
    <>
      <div className="mt-32 space-y-6 md:mx-52">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-4 text-2xl font-bold text-slate-100">
              Gestão de Imóveis
            </h1>
            <div className="mt-1 flex items-center gap-8">
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
          </div>
          <Link href={`/admin/${adminId}/properties/add`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Imóvel
            </Button>
          </Link>
        </div>

        {/* Barra de ações em massa */}
        {selectedProperties.length > 0 && (
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">
                  {selectedProperties.length} imóvel(is) selecionado(s)
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBulkAction("ativo")}
                    size="sm"
                    className="border-green-600 bg-green-800 text-green-100 hover:bg-green-700"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => handleBulkAction("pendente")}
                    variant="outline"
                    size="sm"
                    className="border-yellow-600 bg-yellow-800 text-yellow-100 hover:bg-yellow-700"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Tornar Pendente
                  </Button>
                  <Button
                    onClick={() => handleBulkAction("delete")}
                    variant="outline"
                    size="sm"
                    className="border-red-600 bg-red-800 text-red-100 hover:bg-red-700"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Excluir
                  </Button>
                  <Button
                    onClick={() => setSelectedProperties([])}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total de Imóveis
              </CardTitle>
              <Plus className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">
                {properties.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Ativos
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {properties.filter((p) => p.status === "ativo").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Pendentes
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {properties.filter((p) => p.status === "pendente").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Valor Médio/Diária
              </CardTitle>
              <span className="text-xs text-slate-400">R$</span>
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

        {/* Lista de imóveis */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">
              Imóveis Cadastrados
            </CardTitle>
            <CardDescription className="text-slate-400">
              Lista de todos os imóveis cadastrados no sistema
            </CardDescription>
          </CardHeader>
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
                <div className="mt-6">
                  <Link href={`/admin/${adminId}/properties/add`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Primeiro Imóvel
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedProperties.length === properties.length &&
                            properties.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-slate-300">ID</TableHead>
                      <TableHead className="text-slate-300">Título</TableHead>
                      <TableHead className="text-slate-300">
                        Localização
                      </TableHead>
                      <TableHead className="text-slate-300">Diária</TableHead>
                      <TableHead className="text-slate-300">
                        Capacidade
                      </TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow
                        key={property.id}
                        className="border-slate-700 hover:bg-slate-700/50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedProperties.includes(property.id)}
                            onCheckedChange={(checked) =>
                              handleSelectProperty(
                                property.id,
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium text-slate-200">
                          #{property.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-200">
                            {property.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span className="text-sm text-slate-300">
                              {property.neighborhood &&
                              property.city &&
                              property.state
                                ? `${property.neighborhood}, ${property.city} - ${property.state}`
                                : property.fullAddress ||
                                  "Endereço não informado"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-slate-200">
                            R${" "}
                            {property.dailyRate
                              ? Number(property.dailyRate).toFixed(2)
                              : "0.00"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-300">
                            {property.maxGuests} pessoas
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              property.status === "ativo"
                                ? "border border-green-700 bg-green-900/30 text-green-400"
                                : "border border-yellow-700 bg-yellow-900/30 text-yellow-400"
                            }`}
                          >
                            {property.status === "ativo" ? "Ativo" : "Pendente"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border-slate-700 bg-slate-800"
                            >
                              {property.status === "pendente" ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(property.id, "ativo")
                                  }
                                  className="text-green-400 hover:bg-slate-700 hover:text-green-300"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Aprovar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(property.id, "pendente")
                                  }
                                  className="text-yellow-400 hover:bg-slate-700 hover:text-yellow-300"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Tornar Pendente
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/${adminId}/properties/${property.id}`}
                                  className="flex items-center text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteProperty(property.id)
                                }
                                className="text-red-400 hover:bg-slate-700 hover:text-red-300"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
