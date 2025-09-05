"use client";

import { Calendar as CalendarIcon, Search, Users } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyWithDetails, searchProperties } from "@/lib/get-properties";
import { cn } from "@/lib/utils";

interface AdvancedSearchProps {
  onSearchResults?: (results: PropertyWithDetails[]) => void;
}

export function AdvancedSearch({ onSearchResults }: AdvancedSearchProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Selecione as datas";
    if (!range.to) return `Check-in: ${range.from.toLocaleDateString("pt-BR")}`;
    return `${range.from.toLocaleDateString("pt-BR")} - ${range.to.toLocaleDateString("pt-BR")}`;
  };

  const handleSearch = async () => {
    if (!dateRange?.from || !dateRange?.to || !guests) return;

    setIsSearching(true);
    try {
      const results = await searchProperties({
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        maxGuests: Number(guests),
      });

      console.log(`Encontrados ${results.length} imóveis:`, results);

      // Callback para o componente pai com os resultados
      if (onSearchResults) {
        onSearchResults(results);
      }

      // TODO: Implementar navegação para página de resultados ou exibir na mesma página
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Tabs defaultValue="tradicional" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="tradicional">Busca Tradicional</TabsTrigger>
      </TabsList>

      <TabsContent value="tradicional" className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Seletor de Datas */}
          <div className="md:col-span-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Check-in / Check-out
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange(dateRange)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Seletor de Hóspedes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Número de Hóspedes
            </label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Quantos hóspedes?" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hóspede</SelectItem>
                <SelectItem value="2">2 hóspedes</SelectItem>
                <SelectItem value="3">3 hóspedes</SelectItem>
                <SelectItem value="4">4 hóspedes</SelectItem>
                <SelectItem value="5">5 hóspedes</SelectItem>
                <SelectItem value="6">6 hóspedes</SelectItem>
                <SelectItem value="7">7 hóspedes</SelectItem>
                <SelectItem value="8">8 hóspedes</SelectItem>
                <SelectItem value="9">9 hóspedes</SelectItem>
                <SelectItem value="10">10+ hóspedes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão de Busca */}
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              size="lg"
              className="h-12 w-full bg-[#101828] hover:bg-[#101828]/90"
              disabled={
                !dateRange?.from || !dateRange?.to || !guests || isSearching
              }
            >
              <Search className="mr-2 h-5 w-5" />
              {isSearching ? "Buscando..." : "Buscar Imóveis"}
            </Button>
          </div>
        </div>

        {/* Info sobre a busca */}
        {dateRange?.from && dateRange?.to && guests && (
          <div className="mt-4 rounded-md bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              <strong>Busca configurada:</strong> {guests} hóspede
              {Number(guests) > 1 ? "s" : ""} •{" "}
              {Math.ceil(
                (dateRange.to.getTime() - dateRange.from.getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              noite
              {Math.ceil(
                (dateRange.to.getTime() - dateRange.from.getTime()) /
                  (1000 * 60 * 60 * 24),
              ) > 1
                ? "s"
                : ""}{" "}
              • {dateRange.from.toLocaleDateString("pt-BR")} até{" "}
              {dateRange.to.toLocaleDateString("pt-BR")}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
