"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  CopyCheck,
  Filter,
  Search,
  SquareCheck,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  selectedProperties?: string[];
  onSelectAll?: (propertyIds: string[]) => void;
  onSelectPage?: (propertyIds: string[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSelectAll,
  onSelectPage,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10, // Máximo de 10 itens por página conforme solicitado
      },
    },
  });

  return (
    <div className="w-full">
      {/* Barra de filtros e busca */}
      <div className="py-4">
        {/* Layout para Desktop - uma linha só */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar imóveis..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="border-slate-600 bg-slate-800 pl-10 text-slate-300 placeholder:text-slate-400"
            />
          </div>

          <Button
            variant="outline"
            className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            onClick={() => {
              // Marcar apenas os itens da página atual
              const currentPageRows = table.getRowModel().rows;
              const currentPageIds = currentPageRows.map(
                (row) => (row.original as { id: string }).id,
              );
              onSelectPage?.(currentPageIds);
            }}
          >
            <SquareCheck className="mr-2 h-4 w-4" /> Marcar Página
          </Button>

          <Button
            variant="outline"
            className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            onClick={() => {
              // Marcar todos os itens (incluindo os de outras páginas)
              const allIds = data.map((item) => (item as { id: string }).id);
              onSelectAll?.(allIds);
            }}
          >
            <CopyCheck className="mr-2 h-4 w-4" /> Marcar Todos
          </Button>

          {/* Filtro por status */}
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string[])?.join(
                ",",
              ) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value ? value.split(",") : undefined)
            }
          >
            <SelectTrigger className="w-[180px] border-slate-600 bg-slate-800 text-slate-300">
              <Filter className="mr-2 h-4 w-4 text-slate-300" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="border-slate-700 bg-slate-800">
              <SelectItem value="ativo" className="text-slate-300">
                Apenas Ativos
              </SelectItem>
              <SelectItem value="pendente" className="text-slate-300">
                Apenas Pendentes
              </SelectItem>
              <SelectItem value="ativo,pendente" className="text-slate-300">
                Todos os Status
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Seletor de colunas visíveis */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-slate-700 bg-slate-800"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="text-slate-300 capitalize hover:bg-slate-700"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "dailyRate"
                        ? "Diária"
                        : column.id === "maxGuests"
                          ? "Capacidade"
                          : column.id === "location"
                            ? "Localização"
                            : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Layout para Mobile - duas linhas */}
        <div className="space-y-4 md:hidden">
          {/* Primeira linha - Busca */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar imóveis..."
                value={globalFilter ?? ""}
                onChange={(event) =>
                  setGlobalFilter(String(event.target.value))
                }
                className="border-slate-600 bg-slate-800 pl-10 text-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Segunda linha - Botões e filtros com scroll horizontal */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                onClick={() => {
                  // Marcar apenas os itens da página atual
                  const currentPageRows = table.getRowModel().rows;
                  const currentPageIds = currentPageRows.map(
                    (row) => (row.original as { id: string }).id,
                  );
                  onSelectPage?.(currentPageIds);
                }}
              >
                <SquareCheck className="mr-2 h-4 w-4" /> Marcar Página
              </Button>

              <Button
                variant="outline"
                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                onClick={() => {
                  // Marcar todos os itens (incluindo os de outras páginas)
                  const allIds = data.map(
                    (item) => (item as { id: string }).id,
                  );
                  onSelectAll?.(allIds);
                }}
              >
                <CopyCheck className="mr-2 h-4 w-4" /> Marcar Todos
              </Button>

              {/* Filtro por status */}
              <Select
                value={
                  (
                    table.getColumn("status")?.getFilterValue() as string[]
                  )?.join(",") ?? ""
                }
                onValueChange={(value) =>
                  table
                    .getColumn("status")
                    ?.setFilterValue(value ? value.split(",") : undefined)
                }
              >
                <SelectTrigger className="w-[180px] border-slate-600 bg-slate-800 text-slate-300">
                  <Filter className="mr-2 h-4 w-4 text-slate-300" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800">
                  <SelectItem value="ativo" className="text-slate-300">
                    Apenas Ativos
                  </SelectItem>
                  <SelectItem value="pendente" className="text-slate-300">
                    Apenas Pendentes
                  </SelectItem>
                  <SelectItem value="ativo,pendente" className="text-slate-300">
                    Todos os Status
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Seletor de colunas visíveis */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Colunas <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-slate-700 bg-slate-800"
                >
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="text-slate-300 capitalize hover:bg-slate-700"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id === "dailyRate"
                            ? "Diária"
                            : column.id === "maxGuests"
                              ? "Capacidade"
                              : column.id === "location"
                                ? "Localização"
                                : column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border border-slate-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-slate-700">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-slate-300">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-700 hover:bg-slate-700/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-400"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-slate-400">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-slate-300">
              Linhas por página
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] border-slate-600 bg-slate-800 text-slate-300">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent
                side="top"
                className="border-slate-700 bg-slate-800"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="text-slate-300"
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-slate-300">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 border-slate-600 bg-slate-800 p-0 text-slate-300 hover:bg-slate-700 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para primeira página</span>
              {"<<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 border-slate-600 bg-slate-800 p-0 text-slate-300 hover:bg-slate-700"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para página anterior</span>
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 border-slate-600 bg-slate-800 p-0 text-slate-300 hover:bg-slate-700"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para próxima página</span>
              {">"}
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 border-slate-600 bg-slate-800 p-0 text-slate-300 hover:bg-slate-700 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para última página</span>
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
