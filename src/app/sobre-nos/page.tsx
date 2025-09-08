"use client";

import { BrickWallShield, Gem, House } from "lucide-react";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";

export default function SobreNosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Desktop */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Header Mobile */}
      <div className="block md:hidden">
        <HeaderMobile />
      </div>

      {/* Conteúdo Principal */}
      <main>
        {/* Conteúdo Principal */}
        <section className="mt-5 py-16">
          <div className="mx-auto max-w-4xl px-6 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Missão Principal */}
              <div className="rounded-lg bg-gray-200 p-6 text-center shadow-md">
                <h2 className="mb-6 text-start text-3xl font-semibold text-[#101828] md:text-4xl">
                  Sobre Nós
                </h2>
                <p className="text-start text-lg leading-relaxed text-gray-700">
                  Nossa maior função é fazer o processo da procura por
                  hospedagens o mais simples e seguro possível, trazendo
                  segurança e excelência para cada experiência de viagem.
                </p>
              </div>

              {/* Descrição Detalhada */}
              <div className="rounded-lg bg-[#101828] p-8 md:p-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-100 md:text-3xl">
                    Quem Somos ?
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-300">
                    Somos uma empresa séria que possui unidades para locação
                    mensal e temporada, especializada em selecionar as melhores
                    unidades e localizações do Ceará.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-300">
                    Nosso compromisso é fazer com que a experiência das suas
                    férias seja a mais agradável possível, oferecendo imóveis
                    cuidadosamente selecionados em destinos incríveis como
                    Fortaleza, Jericoacoara, Canoa Quebrada, Cumbuco e muito
                    mais.
                  </p>
                </div>
              </div>

              {/* Valores */}
              <div className="grid gap-8 md:grid-cols-3">
                <div className="rounded-lg bg-gray-200 p-6 text-center shadow-md">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#101828] shadow-md duration-600 hover:scale-105">
                    <span className="text-2xl text-white">
                      <House />
                    </span>
                  </div>
                  <h4 className="mb-2 text-xl font-semibold text-[#101828]">
                    Qualidade
                  </h4>
                  <p className="text-gray-600">
                    Selecionamos cuidadosamente cada imóvel para garantir o
                    melhor padrão de qualidade.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-200 p-6 text-center shadow-md">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#101828] shadow-md duration-600 hover:scale-105">
                    <span className="text-2xl text-white">
                      <BrickWallShield />
                    </span>
                  </div>
                  <h4 className="mb-2 text-xl font-semibold text-[#101828]">
                    Segurança
                  </h4>
                  <p className="text-gray-600">
                    Processo seguro e transparente, com total confiança para
                    hóspedes e proprietários.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-200 p-6 text-center shadow-md">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#101828] shadow-md duration-600 hover:scale-105">
                    <span className="text-2xl text-white">
                      {" "}
                      <Gem />
                    </span>
                  </div>
                  <h4 className="mb-2 text-xl font-semibold text-[#101828]">
                    Excelência
                  </h4>
                  <p className="text-gray-600">
                    Atendimento personalizado e experiências inesquecíveis em
                    cada estadia.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <div className="rounded-lg bg-[#101828] p-8">
                  <h3 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
                    Pronto para sua próxima aventura?
                  </h3>
                  <p className="mb-6 text-gray-300">
                    Descubra os melhores imóveis para sua estadia no Ceará
                  </p>
                  <Link
                    href="/"
                    className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-[#101828] transition-colors hover:bg-gray-100"
                  >
                    Explorar Imóveis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
