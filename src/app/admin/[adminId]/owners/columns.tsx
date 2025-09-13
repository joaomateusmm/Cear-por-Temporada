"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, UserLock } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Owner {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  profileImage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    properties: number;
  };
}

interface ColumnActionsProps {
  owner: Owner;
  onStatusChange: (ownerId: string, newStatus: boolean) => void;
  onDelete: (ownerId: string) => void;
}

function ColumnActions({
  owner,
  onStatusChange,
  onDelete,
}: ColumnActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-9 w-9 border border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-slate-600 bg-slate-800 text-slate-200"
      >
        <DropdownMenuItem
          onClick={() => onStatusChange(owner.id, !owner.isActive)}
          className="cursor-pointer text-yellow-100 hover:bg-slate-700 hover:text-yellow-300"
        >
          <UserLock className="h-4 w-4 text-slate-200" />
          {owner.isActive ? "Desativar" : "Ativar"} Proprietário
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(owner.id)}
          className="cursor-pointer text-red-100 hover:bg-slate-700 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4 text-slate-200" />
          Excluir Proprietário
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createColumns(
  adminId: string,
  onStatusChange: (ownerId: string, newStatus: boolean) => void,
  onDelete: (ownerId: string) => void,
  selectedOwners: string[],
  onSelectOwner: (ownerId: string, checked: boolean) => void,
): ColumnDef<Owner>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const allIds = table
              .getRowModel()
              .rows.map((row) => row.original.id);
            if (value) {
              allIds.forEach((id) => onSelectOwner(id, true));
            } else {
              allIds.forEach((id) => onSelectOwner(id, false));
            }
          }}
          aria-label="Selecionar todos"
          className="border-slate-600 data-[state=checked]:bg-blue-600"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedOwners.includes(row.original.id)}
          onCheckedChange={(value) => onSelectOwner(row.original.id, !!value)}
          aria-label="Selecionar linha"
          className="border-slate-600 data-[state=checked]:bg-blue-600"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fullName",
      header: "Nome",
      cell: ({ row }) => {
        const owner = row.original;
        return (
          <div className="flex items-center space-x-3">
            {owner.profileImage ? (
              <Image
                src={owner.profileImage}
                alt={owner.fullName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-xs font-medium text-slate-200">
                {owner.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium text-slate-200">{owner.fullName}</div>
              <div className="text-sm text-slate-400">ID: {owner.id}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-slate-200">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string | null;
        return (
          <div className="text-slate-200">
            {phone || <span className="text-slate-500">-</span>}
          </div>
        );
      },
    },
    {
      id: "propertiesCount",
      header: "Imóveis",
      cell: ({ row }) => {
        const count = row.original._count?.properties || 0;
        return (
          <div className="text-center">
            <Badge
              variant={count > 0 ? "default" : "secondary"}
              className={
                count > 0
                  ? "bg-blue-600 text-white"
                  : "bg-slate-600 text-slate-300"
              }
            >
              {count} imóvel{count !== 1 ? "eis" : ""}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge
            variant={isActive ? "default" : "destructive"}
            className={
              isActive
                ? "bg-green-800/50 text-white"
                : "bg-red-800/50 text-white"
            }
          >
            {isActive ? "Ativo" : "Inativo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Cadastrado em",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <div className="text-slate-200">
            {new Date(date).toLocaleDateString("pt-BR")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <ColumnActions
          owner={row.original}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
