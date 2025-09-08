"use client";

import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { PropertyWithDetails, searchProperties } from "@/lib/get-properties";
import { cn } from "@/lib/utils";

interface AdvancedSearchProps {
  onSearchResults?: (results: PropertyWithDetails[]) => void;
  redirectOnSearch?: boolean; // Nova prop para controlar redirecionamento
}

export function AdvancedSearch({
  onSearchResults,
  redirectOnSearch = true,
}: AdvancedSearchProps) {
  const router = useRouter();
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

      // Se deve redirecionar (página principal), navega para página de resultados
      if (redirectOnSearch) {
        const searchParams = new URLSearchParams({
          checkIn: dateRange.from.toISOString(),
          checkOut: dateRange.to.toISOString(),
          guests: guests,
        });
        router.push(`/resultados?${searchParams.toString()}`);
      } else {
        // Se não deve redirecionar (página de resultados), chama callback
        if (onSearchResults) {
          onSearchResults(results);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden">
      <div className="grid w-full grid-cols-1 gap-3">
        {/* Seletor de Datas */}
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Check-in e Check-out
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 w-full max-w-full justify-start bg-gray-100 py-6 text-left text-xs font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="text-sm">{formatDateRange(dateRange)}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto max-w-[calc(100vw-2rem)] p-0"
              align="start"
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={(date) => date < new Date()}
                locale={ptBR}
                className="md:hidden"
              />
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
                locale={ptBR}
                className="hidden md:block"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Seletor de Hóspedes */}
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Hóspedes
          </label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="border-input hover:bg-accent hover:text-accent-foreground h-12 w-full max-w-full justify-start border bg-gray-100 py-[23px] text-left font-normal">
              <div className="flex items-center gap-2">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue
                  placeholder="Quantos hóspedes?"
                  className="text-xs"
                />
              </div>
            </SelectTrigger>
            <SelectContent className="max-w-[calc(100vw-2rem)]">
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
        <div className="mt-5">
          <Button
            onClick={handleSearch}
            size="lg"
            className="h-10 w-full max-w-full cursor-pointer bg-gray-50 py-6 text-sm text-[#101828] shadow-md duration-300 hover:bg-gray-200 hover:active:scale-95 md:h-12 md:text-base"
          >
            <Search className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            {isSearching ? "Procurando..." : "Procurar"}
          </Button>
        </div>
      </div>

      {/* Info sobre a busca */}
      {dateRange?.from && dateRange?.to && guests && (
        <div className="mt-3 w-full">
          <p className="text-center text-xs leading-tight text-gray-100 md:text-sm">
            <span className="font-semibold text-gray-200">Busca:</span>
            <span className="opacity-75">
              {" "}
              {guests} hóspede
              {Number(guests) > 1 ? "s" : ""} |{" "}
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
                : ""}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
