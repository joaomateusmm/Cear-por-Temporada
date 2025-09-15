"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({
  trigger,
  open,
  onOpenChange,
}: MobileSidebarProps) {
  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-6">
            {/* Links Principais */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#101828]">
                Navegação
              </h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                  onClick={handleLinkClick}
                >
                  Início
                </Link>
                <Link
                  href="/sobre-nos"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                >
                  Sobre Nós
                </Link>
                <a
                  href="https://api.whatsapp.com/send/?phone=5585992718222&text&type=phone_number&app_absent=0"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                >
                  Contato
                </a>
                <Link
                  href="/proprietario"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                  onClick={handleLinkClick}
                >
                  Proprietário
                </Link>
              </div>
            </div>

            {/* Destinos */}
            <div>
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-lg font-semibold text-[#101828] hover:bg-gray-100">
                  Destinos
                  <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-3">
                  <Link
                    href="/destino/Fortaleza"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Fortaleza
                  </Link>
                  <Link
                    href="/destino/Jericoacoara"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Jericoacoara
                  </Link>
                  <Link
                    href="/destino/Canoa%20Quebrada"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Canoa Quebrada
                  </Link>
                  <Link
                    href="/destino/Cumbuco"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Cumbuco
                  </Link>
                  <Link
                    href="/destino/Beach%20Park"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Beach Park
                  </Link>
                  <Link
                    href="/destino/Praia%20de%20Picos"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Praia de Picos
                  </Link>
                  <Link
                    href="/destino/Morro%20Branco"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Morro Branco
                  </Link>
                  <Link
                    href="/destino/Águas%20Belas"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Águas Belas
                  </Link>
                  <Link
                    href="/destinos"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Todos os Destinos
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Categorias */}
            <div>
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-lg font-semibold text-[#101828] hover:bg-gray-100">
                  Categorias
                  <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-3">
                  <Link
                    href="/categoria"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                  >
                    Todos
                  </Link>
                  <Link
                      href="/categoria/casas"
                      className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    >
                      Casas
                    </Link>
                  <Link
                    href="/categoria/apartamentos"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                    onClick={handleLinkClick}
                  >
                    Apartamentos
                  </Link>
                  <Link
                    href="/categoria/imoveis-destaque"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                  >
                    Imóveis em Destaque
                  </Link>
                  <Link
                    href="/categoria/casas-destaque"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                  >
                    Casas em Destaque
                  </Link>
                  <Link
                  href="/categoria/apartamentos-destaque"
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#101828]"
                >
                  Apartamentos em Destaque
                </Link>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
