import AutoCarousel from "@/components/AutoCarousel";
import { DestinationCarousel } from "@/components/DestinationCarousel";
import Footer from "@/components/Footer";
import { PropertyCarousel } from "@/components/PropertyCarousel";
import ScrollingHeader from "@/components/ScrollingHeader";
import {
  getPropertiesByClass,
  getPropertiesByType,
  PropertyWithDetails,
} from "@/lib/get-properties";

// Componente para renderizar uma seção de propriedades
function PropertySection({
  title,
  description,
  properties,
  category,
}: {
  title: string;
  description: string;
  properties: PropertyWithDetails[];
  category?:
    | "casas"
    | "apartamentos"
    | "casas-destaque"
    | "apartamentos-destaque"
    | "imoveis-destaque";
}) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {description}
          </p>
        </div>

        <PropertyCarousel properties={properties} category={category} />
      </div>
    </section>
  );
}

export default async function Home() {
  // Buscar imóveis por classe "Imóvel em Destaque" - máximo 8
  const featuredProperties = (
    await getPropertiesByClass("Imóvel em Destaque")
  ).slice(0, 8);

  // Buscar imóveis por tipo específico - máximo 8
  const apartments = (await getPropertiesByType("Apartamento")).slice(0, 8);
  const houses = (await getPropertiesByType("Casa")).slice(0, 8);

  // Buscar imóveis em destaque por tipo específico - máximo 8
  const featuredHouses = (
    await getPropertiesByClass("Destaque em Casas")
  ).slice(0, 8);
  const featuredApartments = (
    await getPropertiesByClass("Destaque em Apartamentos")
  ).slice(0, 8);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden scroll-smooth bg-gray-50">
      {/* Header fixo que aparece/desaparece no scroll */}
      <ScrollingHeader />

      {/* Banner Principal com Carrossel */}
      <section
        id="pesquisa"
        className="relative min-h-[60vh] overflow-hidden text-white shadow-lg"
      >
        <AutoCarousel />
      </section>
      {/* Seções de Imóveis por Tipo */}
      <section id="imoveis-destaque">
        <PropertySection
          title="Imóveis em Destaque"
          description="Selecionamos as melhores opções para tornar sua viagem inesquecível."
          properties={featuredProperties}
          category="imoveis-destaque"
        />
      </section>

      <section id="apartamentos">
        <PropertySection
          title="Apartamentos"
          description=" Todos os nossos apartamentos modernos e confortáveis em localização privilegiada"
          properties={apartments}
          category="apartamentos"
        />
      </section>

      <section id="casas">
        <PropertySection
          title="Casas"
          description="Todas as nossas casas espaçosas para você e sua família desfrutarem com total privacidade"
          properties={houses}
          category="casas"
        />
      </section>

      {/* Seção de Destinos */}
      <section id="destinos" className="bg-[#101828] py-16 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-50 md:text-4xl">
              Destinos Populares
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Explore os destinos mais procurados pelos nossos hóspedes no Ceará
            </p>
          </div>
          <div className="rounded-lg">
            <DestinationCarousel />
          </div>
        </div>
      </section>

      {/* Novas Seções de Destaques por Tipo */}
      <section id="casas-destaque">
        <PropertySection
          title="Destaque em: Casas"
          description="Nossos imóveis mais procurados pelos clientes em sua categoria"
          properties={featuredHouses}
          category="casas-destaque"
        />
      </section>

      <section id="apartamentos-destaque">
        <PropertySection
          title="Destaque em: Apartamentos"
          description="Nossos imóveis mais procurados pelos clientes em sua categoria"
          properties={featuredApartments}
          category="apartamentos-destaque"
        />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
