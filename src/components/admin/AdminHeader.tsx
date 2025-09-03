"use client";

import { ChevronRight, User } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAdmin } from "@/lib/admin-session";

export default function AdminHeader() {
  return (
    <section className="relative bg-slate-900 pt-6 text-white">
      {/* Header - com background contido */}
      <header className="relative z-10 mx-auto mt-6 w-[85%] overflow-hidden rounded-4xl border border-gray-100/50 bg-gray-400/20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-2xl font-bold text-white transition-colors hover:text-gray-200"
              >
                Logo
              </Link>
            </div>
            <nav className="hidden items-center gap-6 font-medium md:flex">
              <Link
                href="/"
                className="text-white/90 transition-colors hover:text-white"
              >
                Início
              </Link>
              <a
                href="#"
                className="text-white/90 transition-colors hover:text-white"
              >
                Destinos
              </a>
              <a
                href="#"
                className="text-white/90 transition-colors hover:text-white"
              >
                Sobre
              </a>
              <a
                href="#"
                className="text-white/90 transition-colors hover:text-white"
              >
                Contato
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center rounded-full bg-gray-600/30 px-3 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-600">
                  <User className="mr-1 h-5 w-5" /> <ChevronRight />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logoutAdmin()}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </section>
  );
}
