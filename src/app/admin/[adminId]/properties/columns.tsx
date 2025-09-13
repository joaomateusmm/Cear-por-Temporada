"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Check, Edit, MapPin, MoreHorizontal, Trash2, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipo Property baseado no que está sendo usado na página
export type Property = {
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

export interface ColumnActionsProps {
  property: Property;
  adminId: string;
  onStatusChange: (propertyId: string, newStatus: "ativo" | "pendente") => void;
  onDelete: (propertyId: string) => void;
}

function ColumnActions({
  property,
  adminId,
  onStatusChange,
  onDelete,
}: ColumnActionsProps) {
  return (
    <div className="-mr-11 flex items-center">
      <DropdownMenu>
        <Link href={`/imovel/${property.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="mr-2 border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            <span className="text-sm">Ver</span>
          </Button>
        </Link>
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
              onClick={() => onStatusChange(property.id, "ativo")}
              className="text-green-400 hover:bg-slate-700 hover:text-green-300"
            >
              <Check className="mr-2 h-4 w-4" />
              Aprovar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => onStatusChange(property.id, "pendente")}
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
            onClick={() => onDelete(property.id)}
            className="text-red-400 hover:bg-slate-700 hover:text-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const createColumns = (
  adminId: string,
  onStatusChange: (propertyId: string, newStatus: "ativo" | "pendente") => void,
  onDelete: (propertyId: string) => void,
  selectedProperties: string[],
  onSelectProperty: (propertyId: string, checked: boolean) => void,
): ColumnDef<Property>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selectedProperties.includes(row.original.id)}
        onCheckedChange={(checked) =>
          onSelectProperty(row.original.id, checked as boolean)
        }
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-medium text-slate-200">#{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="font-medium text-slate-200">{row.getValue("title")}</div>
    ),
  },
  {
    id: "location",
    header: "Localização",
    cell: ({ row }) => {
      const property = row.original;
      const location =
        property.neighborhood && property.city && property.state
          ? `${property.neighborhood}, ${property.city} - ${property.state}`
          : property.fullAddress || "Endereço não informado";

      return (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-slate-400" />
          <span className="text-sm text-slate-300">{location}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dailyRate",
    header: () => <div className="text-right">Diária</div>,
    cell: ({ row }) => {
      const dailyRate = row.getValue("dailyRate") as string | null;
      const formatted = dailyRate
        ? Number(dailyRate).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
        : "R$ 0,00";

      return (
        <div className="text-right font-medium text-slate-200">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "maxGuests",
    header: "Capacidade",
    cell: ({ row }) => (
      <span className="text-sm text-slate-300">
        {row.getValue("maxGuests")} pessoas
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            status === "ativo"
              ? "border border-green-700 bg-green-900/30 text-green-400"
              : "border border-yellow-700 bg-yellow-900/30 text-yellow-400"
          }`}
        >
          {status === "ativo" ? "Ativo" : "Pendente"}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <ColumnActions
            property={row.original}
            adminId={adminId}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
