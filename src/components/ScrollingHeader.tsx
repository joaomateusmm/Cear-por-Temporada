"use client";

import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ScrollingHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);

    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed left-1/2 z-50 mx-auto w-full -translate-x-1/2 border-b border-gray-100/30 bg-black/25 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? "h-32" : "h-16"
      }`}
    >
      <div
        className={`mx-auto max-w-full bg-gray-50 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="mx-60 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl font-bold text-[#101828] transition-colors hover:text-gray-200"
            >
              Logo
            </Link>
          </div>
          <nav className="hidden items-center gap-6 font-medium md:flex">
            <Link href="/" className="text-[#101828] transition-colors">
              Início
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 border-none text-[#101828] transition-colors outline-none hover:text-[#101828] focus:ring-0 focus:outline-none">
                Destinos
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-gray-700 bg-gray-800/95 backdrop-blur-md">
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Fortaleza
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Jericoacoara
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Canoa Quebrada
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Praia de Picos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Morro Branco
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Águas Belas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Cumbuco
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Beach Park
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <Link href="#" className="w-full">
                    Outros
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 border-none text-[#101828] transition-colors outline-none focus:ring-0 focus:outline-none">
                Categorias
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-gray-700 bg-gray-800/95 backdrop-blur-md">
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <a href="#casas" className="w-full scroll-smooth">
                    Casas
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <a href="#apartamentos" className="w-full scroll-smooth">
                    Apartamentos
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <a href="#imoveis-destaque" className="w-full scroll-smooth">
                    Imóveis em Destaque
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <a href="#casas-destaque" className="w-full scroll-smooth">
                    Casas em Destaque
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <a
                    href="#apartamentos-destaque"
                    className="w-full scroll-smooth"
                  >
                    Apartamentos em Destaque
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                  <a href="#casas-destaque" className="w-full scroll-smooth">
                    Experiência a Dois
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="#" className="text-[#101828]">
              Sobre
            </a>
            <a href="#" className="text-[#101828]">
              Contato
            </a>
            <a href="#footer" className="text-[#101828]">
              Proprietário
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button className="rounded-3xl bg-gray-300/20 p-2 px-4 text-[#101828] shadow-md backdrop-blur-md duration-500 hover:bg-gray-300/25">
              Entrar
            </Button>
            <Button className="rounded-3xl bg-[#101828] p-2 px-4 shadow-md backdrop-blur-md duration-500 hover:bg-[#101828]/90">
              Criar Conta
            </Button>
          </div>
        </div>
      </div>
      <div
        className={`mx-auto max-w-full bg-[#101828]/50 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          isVisible ? "translate-y-0" : "-translate-y-16"
        }`}
      >
        <div className="mx-60 flex h-16 items-center justify-between">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${
              isVisible
                ? "translate-x-4 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <Link
              href="/"
              className="text-2xl font-bold text-white transition-colors hover:text-gray-200"
            >
              Logo
            </Link>
          </div>
          <nav className="mr-32 hidden items-center gap-6 font-medium md:flex">
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-white"
            >
              Fortaleza
            </a>
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-white"
            >
              Cumbuco
            </a>
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-white"
            >
              Jericoaquara
            </a>
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-white"
            >
              Canoa Quebrada
            </a>
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-white"
            >
              Beach Park
            </a>
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-white"
            >
              Outros
            </a>
          </nav>
          <div className="flex items-center">
            <Button className="rounded-3xl bg-gray-300/20 p-2 px-8 backdrop-blur-md duration-500 hover:bg-gray-300/40">
              <Search />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
