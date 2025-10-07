"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, UserLock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface ColumnActionsProps {
  user: AdminUser;
  onStatusChange: (userId: number, newStatus: boolean) => void;
  onDelete: (userId: number) => void;
}

function ColumnActions({ user, onStatusChange, onDelete }: ColumnActionsProps) {
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
          onClick={() => onStatusChange(user.id, !user.isActive)}
          className="cursor-pointer text-white hover:bg-slate-700 hover:text-white"
        >
          <UserLock className="mr-2 h-4 w-4 text-slate-200" />
          {user.isActive ? "Desativar" : "Ativar"} Administrador
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(user.id)}
          className="cursor-pointer text-red-500 hover:bg-slate-700 hover:text-red-500 font-medium"
        >
          <Trash2 className="mr-2 h-4 w-4 text-slate-200" />
          Excluir Administrador
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createColumns(
  onStatusChange: (userId: number, newStatus: boolean) => void,
  onDelete: (userId: number) => void,
  selectedUsers: number[],
  onSelectUser: (userId: number, checked: boolean) => void,
): ColumnDef<AdminUser>[] {
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
              allIds.forEach((id) => onSelectUser(id, true));
            } else {
              allIds.forEach((id) => onSelectUser(id, false));
            }
          }}
          aria-label="Selecionar todos"
          className="border-slate-600 data-[state=checked]:bg-blue-600"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedUsers.includes(row.original.id)}
          onCheckedChange={(value) => onSelectUser(row.original.id, !!value)}
          aria-label="Selecionar linha"
          className="border-slate-600 data-[state=checked]:bg-blue-600"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-xs font-medium text-slate-200">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-slate-200">{user.name}</div>
              <div className="text-sm text-slate-400">ID: {user.id}</div>
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
          user={row.original}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
