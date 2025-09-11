"use client";

import { ChevronDown, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MobileSidebar } from "../MobileSidebar";

export default function ScrollingHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
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
          <div className="mx-4 flex h-16 items-center justify-between md:mx-60">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-1.png"
                alt="Ceará por Temporada"
                width={150}
                height={40}
                className="h-auto w-40 cursor-pointer"
              />
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
                    <a
                      href="#imoveis-destaque"
                      className="w-full scroll-smooth"
                    >
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
              <Link href="/proprietario" className="text-[#101828]">
                Proprietário
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              {/* Botões ocultos para uso futuro */}
              {/* <Button className="hidden rounded-3xl bg-gray-300/20 p-2 px-4 text-[#101828] shadow-md backdrop-blur-md duration-500 hover:bg-gray-300/25 md:block">
              Entrar
            </Button>
            <Button className="rounded-3xl bg-[#101828] p-1 px-2 text-sm shadow-md backdrop-blur-md duration-500 hover:bg-[#101828]/90 md:p-2 md:px-4 md:text-base">
              Criar Conta
            </Button> */}

              {/* Menu hambúrguer para mobile */}
              <div className="md:hidden">
                <MobileSidebar
                  trigger={
                    <Button
                      variant="outline"
                      className="rounded-full border-none px-1 text-[#101828] shadow-md"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  }
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`mx-auto max-w-full bg-[#101828]/50 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            isVisible ? "translate-y-0" : "-translate-y-16"
          }`}
        >
          <div className="mx-4 flex h-16 items-center justify-between md:mx-60">
            <div
              className={`flex flex-shrink-0 items-center gap-3 transition-all duration-300 ${
                isVisible
                  ? "translate-x-4 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <Image
                src="/logo-1.png"
                alt="Ceará por Temporada"
                width={150}
                height={40}
                className="h-auto w-40 cursor-pointer"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="mr-0 hidden flex-1 items-center gap-3 font-medium md:mr-32 md:flex md:gap-6">
              <a
                href="#"
                className="text-sm text-white/90 transition-colors hover:text-white md:text-base"
              >
                Fortaleza
              </a>
              <a
                href="#"
                className="text-sm text-white/90 transition-colors hover:text-white md:text-base"
              >
                Cumbuco
              </a>
              <a
                href="#"
                className="text-sm text-white/90 transition-colors hover:text-white md:text-base"
              >
                Jericoacoara
              </a>
              <a
                href="#"
                className="text-sm text-white/90 transition-colors hover:text-white md:text-base"
              >
                Canoa Quebrada
              </a>
              <a
                href="#"
                className="text-sm text-white/90 transition-colors hover:text-white md:text-base"
              >
                Beach Park
              </a>
              <a
                href="#"
                className="text-sm text-white/90 transition-colors hover:text-white md:text-base"
              >
                Outros
              </a>
            </nav>

            <div className="flex flex-shrink-0 items-center">
              <Button className="rounded-3xl bg-gray-300/20 p-1 px-4 text-sm backdrop-blur-md duration-500 hover:bg-gray-300/40 md:p-2 md:px-8 md:text-base">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Espaçador para compensar a altura do header fixo */}
      <div className="h-16"></div>
    </>
  );
}
