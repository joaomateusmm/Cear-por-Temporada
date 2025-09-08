"use client";

import { ArrowLeft, Edit, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DeletePropertyButton } from "@/components/DeletePropertyButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const handlePropertyDeleted = async () => {
    // Recarregar a lista de propriedades após exclusão
    try {
      const propertiesData = await getPropertiesByAdmin(adminId);
      setProperties(propertiesData);
    } catch (error) {
      console.error("Erro ao recarregar propriedades:", error);
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
                {properties.filter((p) => p.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Inativos
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {properties.filter((p) => p.status !== "active").length}
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
                              property.status === "active"
                                ? "border border-green-700 bg-green-900/30 text-green-400"
                                : "border border-red-700 bg-red-900/30 text-red-400"
                            }`}
                          >
                            {property.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/${adminId}/properties/${property.id}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Link>
                            <DeletePropertyButton
                              propertyId={property.id}
                              propertyTitle={property.title}
                              onPropertyDeleted={handlePropertyDeleted}
                            />
                          </div>
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
