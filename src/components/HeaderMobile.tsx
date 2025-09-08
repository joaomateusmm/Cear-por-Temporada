"use client";

import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { MobileSidebar } from "./MobileSidebar";

export default function HeaderMobile() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 block h-16 w-full bg-black/25 backdrop-blur-sm md:hidden">
        <div className="h-full w-full bg-[#101828]/60 px-4 sm:px-6 lg:px-8">
          <div className="mx-4 flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 items-center gap-3">
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

            <div className="flex flex-shrink-0 items-center gap-3">
              <Button
                variant="default"
                className="rounded-full border-none bg-gray-800/20 text-sm text-white shadow-md backdrop-blur-md duration-500 hover:brightness-110"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Menu hambúrguer para mobile */}
              <div>
                <MobileSidebar
                  trigger={
                    <Button
                      variant="default"
                      className="rounded-full border-none bg-gray-800/20 text-sm text-white shadow-md backdrop-blur-md duration-500 hover:bg-gray-800/40"
                    >
                      <Menu className="h-8 w-8" />
                    </Button>
                  }
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
