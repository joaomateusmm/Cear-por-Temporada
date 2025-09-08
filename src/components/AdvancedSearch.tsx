"use client";

import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
  searchMode?: "date" | "location"; // Novo: modo de pesquisa
  onModeChange?: (mode: "date" | "location") => void; // Callback para mudança de modo
}

export function AdvancedSearch({
  onSearchResults,
  redirectOnSearch = true,
  searchMode = "date",
}: AdvancedSearchProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // Estados para pesquisa por localização
  const [municipality, setMunicipality] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");

  // Lista completa dos 184 municípios do Ceará
  const cearaMunicipalities = [
    "Abaiara",
    "Acarape",
    "Acaraú",
    "Acopiara",
    "Aiuaba",
    "Alcântaras",
    "Altaneira",
    "Alto Santo",
    "Amontada",
    "Antonina do Norte",
    "Apuiarés",
    "Aquiraz",
    "Aracati",
    "Aracoiaba",
    "Ararendá",
    "Araripe",
    "Aratuba",
    "Arneiroz",
    "Assaré",
    "Aurora",
    "Baixio",
    "Banabuiú",
    "Barbalha",
    "Barreira",
    "Barro",
    "Barroquinha",
    "Baturité",
    "Beberibe",
    "Bela Cruz",
    "Boa Viagem",
    "Brejo Santo",
    "Camocim",
    "Campos Sales",
    "Canindé",
    "Capistrano",
    "Caridade",
    "Caririaçu",
    "Cariré",
    "Cariús",
    "Carnaubal",
    "Cascavel",
    "Catarina",
    "Catunda",
    "Caucaia",
    "Cedro",
    "Chaval",
    "Chorozinho",
    "Choró",
    "Coreaú",
    "Crateús",
    "Crato",
    "Croatá",
    "Cruz",
    "Deputado Irapuan Pinheiro",
    "Ererê",
    "Eusébio",
    "Farias Brito",
    "Forquilha",
    "Fortaleza",
    "Fortim",
    "Frecheirinha",
    "General Sampaio",
    "Granja",
    "Granjeiro",
    "Graça",
    "Groaíras",
    "Guaiúba",
    "Guaraciaba do Norte",
    "Guaramiranga",
    "Hidrolândia",
    "Horizonte",
    "Ibaretama",
    "Ibiapina",
    "Ibicuitinga",
    "Icapuí",
    "Icó",
    "Iguatu",
    "Independência",
    "Ipaporanga",
    "Ipaumirim",
    "Ipu",
    "Ipueiras",
    "Iracema",
    "Irauçuba",
    "Itaitinga",
    "Itaiçaba",
    "Itapajé",
    "Itapipoca",
    "Itapiúna",
    "Itarema",
    "Itatira",
    "Jaguaretama",
    "Jaguaribara",
    "Jaguaribe",
    "Jaguaruana",
    "Jardim",
    "Jati",
    "Jijoca de Jericoacoara",
    "Juazeiro do Norte",
    "Jucás",
    "Lavras da Mangabeira",
    "Limoeiro do Norte",
    "Madalena",
    "Maracanaú",
    "Maranguape",
    "Marco",
    "Martinólope",
    "Massapê",
    "Mauriti",
    "Meruoca",
    "Milagres",
    "Milhã",
    "Miraíma",
    "Missão Velha",
    "Mombaça",
    "Monsenhor Tabosa",
    "Morada Nova",
    "Moraújo",
    "Morrinhos",
    "Mucambo",
    "Mulungu",
    "Nova Olinda",
    "Nova Russas",
    "Novo Oriente",
    "Ocara",
    "Orós",
    "Pacajus",
    "Pacatuba",
    "Pacoti",
    "Pacujá",
    "Palhano",
    "Palmácia",
    "Paracuru",
    "Paraipaba",
    "Parambú",
    "Paramoti",
    "Pedra Branca",
    "Penaforte",
    "Pentecoste",
    "Pereiro",
    "Pindoretama",
    "Piquet Carneiro",
    "Pires Ferreira",
    "Poranga",
    "Porteiras",
    "Potengi",
    "Potiretama",
    "Quiterianópolis",
    "Quixadá",
    "Quixelô",
    "Quixeramobim",
    "Quixeré",
    "Redenção",
    "Reriutaba",
    "Russas",
    "Saboeiro",
    "Salitre",
    "Santa Quitéria",
    "Santana do Acaraú",
    "Santana do Cariri",
    "São Benedito",
    "São Gonçalo do Amarante",
    "São João do Jaguaribe",
    "São Luís do Curu",
    "Senador Pompeu",
    "Senador Sá",
    "Sobral",
    "Solonópole",
    "Tabuleiro do Norte",
    "Tamboril",
    "Tarrafas",
    "Tauá",
    "Tejuçuoca",
    "Tianguá",
    "Trairi",
    "Tururu",
    "Ubajara",
    "Umari",
    "Umirim",
    "Uruburetama",
    "Uruoca",
    "Varjota",
    "Várzea Alegre",
    "Viçosa do Ceará",
  ];

  // Função para lidar com mudanças no input de cidade
  const handleCityChange = (value: string) => {
    setCity(value);
  };

  // Função para lidar com mudanças no input de bairro
  const handleNeighborhoodChange = (value: string) => {
    setNeighborhood(value);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Selecione as datas";
    if (!range.to) return `Check-in: ${range.from.toLocaleDateString("pt-BR")}`;
    return `${range.from.toLocaleDateString("pt-BR")} - ${range.to.toLocaleDateString("pt-BR")}`;
  };

  const handleSearch = async () => {
    if (searchMode === "date") {
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
    } else {
      // Pesquisa por localização
      if (!municipality && !city && !neighborhood) return;

      setIsSearching(true);
      try {
        const results = await searchProperties({
          municipality: municipality || undefined,
          city: city || undefined,
          neighborhood: neighborhood || undefined,
        });

        console.log(
          `Encontrados ${results.length} imóveis por localização:`,
          results,
        );

        // Se deve redirecionar (página principal), navega para página de resultados
        if (redirectOnSearch) {
          const searchParams = new URLSearchParams();
          if (municipality) searchParams.set("municipality", municipality);
          if (city) searchParams.set("city", city);
          if (neighborhood) searchParams.set("neighborhood", neighborhood);
          router.push(`/resultados?${searchParams.toString()}`);
        } else {
          // Se não deve redirecionar (página de resultados), chama callback
          if (onSearchResults) {
            onSearchResults(results);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis por localização:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden">
      <div className="grid w-full grid-cols-1 gap-3">
        {searchMode === "date" ? (
          <>
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
                    <span className="text-sm">
                      {formatDateRange(dateRange)}
                    </span>
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
          </>
        ) : (
          <>
            {/* Pesquisa por Localização */}
            {/* Seletor de Município */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Município
              </label>
              <Select value={municipality} onValueChange={setMunicipality}>
                <SelectTrigger className="border-input hover:bg-accent hover:text-accent-foreground h-12 w-full max-w-full justify-start border bg-gray-100 py-[23px] text-left font-normal">
                  <div className="flex items-center gap-2">
                    <MapPin className="mr-2 h-4 w-4" />
                    <SelectValue
                      placeholder="Selecione o município"
                      className="text-xs"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-2rem)]">
                  {cearaMunicipalities.map((municipality) => (
                    <SelectItem key={municipality} value={municipality}>
                      {municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seletor de Cidade */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Cidade
              </label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Digite o nome da cidade"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="h-12 w-full bg-gray-100 pr-4 pl-10 text-sm placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Seletor de Bairro */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Bairro
              </label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Digite o nome do bairro"
                  value={neighborhood}
                  onChange={(e) => handleNeighborhoodChange(e.target.value)}
                  className="h-12 w-full bg-gray-100 pr-4 pl-10 text-sm placeholder:text-gray-500"
                />
              </div>
            </div>
          </>
        )}

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
      {searchMode === "date" && dateRange?.from && dateRange?.to && guests && (
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

      {/* Info sobre busca por localização */}
      {searchMode === "location" && (municipality || city || neighborhood) && (
        <div className="mt-3 w-full">
          <p className="text-center text-xs leading-tight text-gray-100 md:text-sm">
            <span className="font-semibold text-gray-200">Busca por:</span>
            <span className="opacity-75">
              {municipality && ` Município: ${municipality}`}
              {city && ` | Cidade: ${city}`}
              {neighborhood && ` | Bairro: ${neighborhood}`}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
