"use client";

import { ChevronDown, Search } from "lucide-react";
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

export default function Header() {
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
    <>
      <header
        className={`fixed top-0 left-0 z-50 hidden w-full bg-black/25 backdrop-blur-sm transition-all duration-300 md:block ${
          isVisible ? "h-32" : "h-16"
        }`}
      >
        {/* Header branco */}
        <div
          className={`mx-auto max-w-full bg-gray-50 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <div className="mx-4 flex h-16 items-center justify-between md:mx-60">
            <div className="flex items-center gap-3">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/logo-alternativa.svg"
                  alt="Ceará por Temporada"
                  width={150}
                  height={40}
                  className="h-auto w-40 cursor-pointer"
                />
              </Link>
            </div>
            <nav className="mr-35 hidden items-center gap-8 font-medium md:flex">
              <Link
                href="/"
                className="whitespace-nowrap text-[#101828] transition-colors"
              >
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
                    <Link
                      href="/categoria/casas"
                      className="w-full scroll-smooth"
                    >
                      Casas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                    <Link
                      href="/categoria/apartamentos"
                      className="w-full scroll-smooth"
                    >
                      Apartamentos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                    <Link
                      href="/categoria/imoveis-destaque"
                      className="w-full scroll-smooth"
                    >
                      Imóveis em Destaque
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                    <Link
                      href="/categoria/casas-destaque"
                      className="w-full scroll-smooth"
                    >
                      Casas em Destaque
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                    <Link
                      href="/categoria/apartamentos-destaque"
                      className="w-full scroll-smooth"
                    >
                      Apartamentos em Destaque
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700/50">
                    <Link href="/categoria" className="w-full scroll-smooth">
                      Todos
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/sobre-nos" className="">
                Sobre Nós
              </Link>
              <a
                href="https://api.whatsapp.com/send/?phone=5585992718222&text&type=phone_number&app_absent=0"
                className="whitespace-nowrap text-[#101828]"
              >
                Contato
              </a>
              <a href="#footer" className="whitespace-nowrap text-[#101828]">
                Proprietário
              </a>
            </nav>
            <div className="flex items-center gap-2">
              {/* Botões ocultos para uso futuro */}
              {/* <Button className="hidden rounded-3xl bg-gray-300/20 p-2 px-4 text-[#101828] shadow-md backdrop-blur-md duration-500 hover:bg-gray-300/25 md:block">
              Entrar
            </Button>
            <Button className="rounded-3xl bg-[#101828] p-1 px-2 text-sm shadow-md backdrop-blur-md duration-500 hover:bg-[#101828]/90 md:p-2 md:px-4 md:text-base">
              Criar Conta
            </Button> */}
            </div>
          </div>
        </div>
        {/* Header azul */}
        <div
          className={`mx-auto max-w-full bg-[#101828]/50 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            isVisible ? "translate-y-0" : "-translate-y-16"
          }`}
        >
          <div className="relative mx-4 flex h-16 items-center justify-between md:mx-60">
            <div
              className={`flex flex-shrink-0 items-center gap-3 transition-all duration-300 ${
                isVisible
                  ? "translate-x-4 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/logo-alternativa.svg"
                  alt="Ceará por Temporada"
                  width={150}
                  height={40}
                  className="h-auto w-40 cursor-pointer"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centralizada */}
            <nav className="absolute top-1/2 left-1/2 ml-2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center gap-8 font-medium md:flex">
              <a
                href="#"
                className="text-base whitespace-nowrap text-white/90 transition-colors hover:text-white"
              >
                Fortaleza
              </a>
              <a
                href="#"
                className="text-base whitespace-nowrap text-white/90 transition-colors hover:text-white"
              >
                Cumbuco
              </a>
              <a
                href="#"
                className="text-base whitespace-nowrap text-white/90 transition-colors hover:text-white"
              >
                Jericoacoara
              </a>
              <a
                href="#"
                className="text-base whitespace-nowrap text-white/90 transition-colors hover:text-white"
              >
                Canoa Quebrada
              </a>
              <a
                href="#"
                className="text-base whitespace-nowrap text-white/90 transition-colors hover:text-white"
              >
                Beach Park
              </a>
              <a
                href="#"
                className="text-base whitespace-nowrap text-white/90 transition-colors hover:text-white"
              >
                Outros
              </a>
            </nav>

            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <Button className="rounded-3xl bg-gray-300/20 p-1 px-4 text-sm backdrop-blur-md duration-500 hover:bg-gray-300/40 md:p-2 md:px-8 md:text-base">
                  <Search className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Espaçador para compensar a altura do header fixo */}
      <div className="hidden h-16 md:block"></div>
    </>
  );
}
