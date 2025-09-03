"use client";

import { Edit, MapPin, Plus } from "lucide-react";
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando propriedades...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null; // Será redirecionado
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestão de Imóveis
          </h1>
          <p className="text-gray-600">
            Gerencie todos os imóveis cadastrados na plataforma
          </p>
        </div>
        <Link href={`/admin/${adminId}/properties/add`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Imóveis
            </CardTitle>
            <Plus className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {properties.filter((p) => p.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {properties.filter((p) => p.status !== "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Médio/Diária
            </CardTitle>
            <span className="text-muted-foreground text-xs">R$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
      <Card>
        <CardHeader>
          <CardTitle>Imóveis Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os imóveis cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="py-8 text-center">
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum imóvel encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando seu primeiro imóvel à plataforma.
              </p>
              <div className="mt-6">
                <Link href={`/admin/${adminId}/properties/add`}>
                  <Button>
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
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Diária</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        #{property.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{property.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">
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
                        <span className="font-medium">
                          R${" "}
                          {property.dailyRate
                            ? Number(property.dailyRate).toFixed(2)
                            : "0.00"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {property.maxGuests} pessoas
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            property.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
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
                            <Button variant="outline" size="sm">
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
  );
}
