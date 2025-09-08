"use client";

import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";

const LAST_UPDATED = "08/09/2025";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white text-[#101828]">
      {/* Headers */}
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="md:hidden">
        <HeaderMobile />
      </div>

      <main className="pt-10 md:pt-12">
        {/* Hero */}
        <section className="mx-auto mt-12 max-w-5xl px-6">
          <div className="rounded-lg bg-[#101828] px-8 py-14 text-center text-white">
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">
              Termos de Uso & Política de Privacidade
            </h1>
            <p className="mx-auto max-w-3xl text-base text-gray-300 md:text-lg">
              Transparência e responsabilidade no uso da plataforma de
              hospedagens no Ceará.
            </p>
            <p className="mt-6 text-xs tracking-wide text-gray-400 uppercase">
              Última atualização: {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* Navegação Interna */}
        <section className="mx-auto mt-8 max-w-5xl px-6">
          <div className="flex flex-wrap gap-3 text-sm">
            {[
              ["#definicoes", "Definições"],
              ["#escopo", "Escopo do Serviço"],
              ["#cadastro-proprietarios", "Cadastro de Proprietários"],
              ["#publicacao-imoveis", "Publicação de Imóveis"],
              ["#reservas", "Reservas"],
              ["#pagamentos-taxas", "Pagamentos & Taxas"],
              ["#cancelamentos", "Cancelamentos"],
              ["#estadia", "Regras da Estadia"],
              ["#localizacao", "Localização"],
              ["#seguranca", "Segurança"],
              ["#destaques", "Classes de Destaque"],
              ["#limite-resp", "Limitações de Responsabilidade"],
              ["#propriedade-intelectual", "Propriedade Intelectual"],
              ["#privacidade", "Privacidade (LGPD)"],
              ["#dados-direitos", "Direitos dos Titulares"],
              ["#retencao", "Retenção de Dados"],
              ["#alteracoes", "Alterações"],
              ["#contato", "Contato & Suporte"],
              ["#foro", "Legislação e Foro"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full bg-gray-100 px-4 py-2 font-medium text-[#101828] transition-colors hover:bg-gray-200"
              >
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* Conteúdo */}
        <section className="mx-auto mt-12 max-w-5xl space-y-14 px-6 pb-20 leading-relaxed">
          {/* Definições */}
          <article id="definicoes" className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Definições</h2>
            <p className="text-gray-700">
              Para fins deste documento: Plataforma ou Nós refere-se ao portal
              Ceará por Temporada; Usuário ou Hóspede é a pessoa que navega ou
              solicita hospedagem; Proprietário ou Anunciante é quem cadastra um
              imóvel; Imóvel ou Unidade é a propriedade disponibilizada para
              locação por temporada; Reserva é a solicitação de estadia; Taxas
              incluem valores adicionais como limpeza, serviço ou caução quando
              aplicável.
            </p>
          </article>

          {/* Escopo */}
          <article id="escopo" className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Escopo do Serviço</h2>
            <p className="text-gray-700">
              Fornecemos uma plataforma de intermediação digital para divulgação
              de imóveis por temporada no Ceará. Não somos imobiliária
              tradicional, nem parte dos contratos de locação celebrados entre
              hóspedes e proprietários. As informações exibidas são fornecidas
              pelos anunciantes e podem ser verificadas periodicamente.
            </p>
          </article>

          {/* Cadastro Proprietários */}
          <article id="cadastro-proprietarios" className="space-y-4">
            <h2 className="text-2xl font-semibold">
              3. Cadastro de Proprietários
            </h2>
            <p className="text-gray-700">
              Apenas proprietários/anunciantes podem manter contas
              administrativas. O cadastro exige dados verdadeiros. Podemos
              suspender ou remover perfis em caso de fraude, uso indevido,
              violação legal ou má-fé reiterada.
            </p>
          </article>

          {/* Publicação de Imóveis */}
          <article id="publicacao-imoveis" className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Publicação de Imóveis</h2>
            <ul className="list-inside list-disc space-y-2 text-gray-700">
              <li>
                Responsabilidade do proprietário quanto à veracidade das
                descrições.
              </li>
              <li>Disponibilidade e valores devem estar atualizados.</li>
              <li>
                É proibida publicação de conteúdo enganoso, ofensivo ou ilegal.
              </li>
              <li>
                Reservamo-nos o direito de ajustar a categorização ou remover
                anúncios.
              </li>
            </ul>
          </article>

          {/* Reservas */}
          <article id="reservas" className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Reservas</h2>
            <p className="text-gray-700">
              O processo de reserva envolve consulta, confirmação de
              disponibilidade e aceite explícito do proprietário. A reserva
              somente é válida após confirmação formal. Podemos oferecer suporte
              em comunicação, mas não garantimos resposta imediata em todos os
              casos.
            </p>
          </article>

          {/* Pagamentos & Taxas */}
          <article id="pagamentos-taxas" className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Pagamentos & Taxas</h2>
            <p className="text-gray-700">
              As condições de pagamento (diária, caução, limpeza ou outras
              taxas) são informadas no anúncio ou durante a negociação. Quando
              intermediação de cobrança ocorrer, os comprovantes serão
              disponibilizados pelos canais oficiais.
            </p>
          </article>

          {/* Cancelamentos */}
          <article id="cancelamentos" className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Cancelamentos</h2>
            <p className="text-gray-700">
              Políticas podem variar por imóvel. Cancelamentos motivados por
              força maior (eventos climáticos severos, interdições) serão
              analisados caso a caso.
            </p>
          </article>

          {/* Estadia */}
          <article id="estadia" className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Regras da Estadia</h2>
            <p className="text-gray-700">
              Horários de check-in/out, regras de convivência, limite de
              hóspedes, política de pets e responsabilidade por danos são
              definidos pelo proprietário e devem ser respeitados. Danos podem
              gerar cobrança adicional.
            </p>
          </article>

          {/* Localização */}
          <article id="localizacao" className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Localização</h2>
            <p className="text-gray-700">
              Exibimos localização em nível de bairro/município antes da
              confirmação final. Endereço completo pode ser compartilhado após
              confirmação da estadia.
            </p>
          </article>

          {/* Segurança */}
          <article id="seguranca" className="space-y-4">
            <h2 className="text-2xl font-semibold">
              10. Segurança e Conformidade
            </h2>
            <p className="text-gray-700">
              Incentivamos o reporte de irregularidades. Práticas
              discriminatórias são proibidas. Podemos adotar medidas internas
              para prevenir fraude ou abuso.
            </p>
          </article>

          {/* Destaques */}
          <article id="destaques" className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Classes de Destaque</h2>
            <p className="text-gray-700">
              Rótulos como Imóvel em Destaque, Destaque em Casas ou Destaque em
              Apartamentos refletem critérios internos (curadoria, demanda ou
              performance). Esses destaques não constituem garantia de qualidade
              subjetiva.
            </p>
          </article>

          {/* Limitações */}
          <article id="limite-resp" className="space-y-4">
            <h2 className="text-2xl font-semibold">
              12. Limitações de Responsabilidade
            </h2>
            <p className="text-gray-700">
              A plataforma é fornecida no estado em que se encontra. Não
              respondemos por: conduta de terceiros, indisponibilidade
              temporária, diferenças de expectativa subjetiva ou perdas
              indiretas. Fazemos esforços razoáveis de estabilidade e segurança.
            </p>
          </article>

          {/* Propriedade Intelectual */}
          <article id="propriedade-intelectual" className="space-y-4">
            <h2 className="text-2xl font-semibold">
              13. Propriedade Intelectual
            </h2>
            <p className="text-gray-700">
              Marca, identidade visual, componentes, código e conteúdo
              institucional são protegidos. É vedado scraping, engenharia
              reversa ou uso não autorizado. O conteúdo enviado por
              proprietários nos concede licença limitada para exibição.
            </p>
          </article>

          {/* PRIVACIDADE */}
          <article id="privacidade" className="space-y-4">
            <h2 className="text-2xl font-semibold">
              14. Política de Privacidade (LGPD)
            </h2>
            <p className="text-gray-700">
              Tratamos dados pessoais com base em execução de contrato, legítimo
              interesse e consentimento quando necessário. Coletamos:
              identificação de proprietários, contato, dados de imóvel,
              registros técnicos (logs) e interações operacionais.
            </p>
          </article>

          {/* Direitos dos Titulares */}
          <article id="dados-direitos" className="space-y-4">
            <h2 className="text-2xl font-semibold">
              15. Direitos dos Titulares
            </h2>
            <ul className="list-inside list-disc space-y-2 text-gray-700">
              <li>Acesso, correção e atualização.</li>
              <li>Solicitação de anonimização ou exclusão quando aplicável.</li>
              <li>Portabilidade mediante viabilidade técnica.</li>
              <li>Revogação de consentimento (sem retroatividade).</li>
            </ul>
            <p className="text-gray-700">
              Solicitações podem ser enviadas ao canal de suporte oficial.
            </p>
          </article>

          {/* Retenção */}
          <article id="retencao" className="space-y-4">
            <h2 className="text-2xl font-semibold">16. Retenção de Dados</h2>
            <p className="text-gray-700">
              Mantemos dados enquanto necessários para obrigações legais,
              auditoria e prevenção de fraudes. Após tais períodos, removemos ou
              anonimizamos.
            </p>
          </article>

          {/* Alterações */}
          <article id="alteracoes" className="space-y-4">
            <h2 className="text-2xl font-semibold">
              17. Alterações destes Termos
            </h2>
            <p className="text-gray-700">
              Poderemos atualizar este documento. Alterações materiais serão
              destacadas na plataforma. O uso continuado após publicação
              constitui aceite.
            </p>
          </article>

          {/* Contato */}
          <article id="contato" className="space-y-4">
            <h2 className="text-2xl font-semibold">18. Contato & Suporte</h2>
            <p className="text-gray-700">
              Canal oficial para dúvidas, denúncias ou solicitações de dados:{" "}
              <span className="font-medium">
                WhatsApp corporativo / E-mail institucional
              </span>
              .
            </p>
          </article>

          {/* Foro */}
          <article id="foro" className="space-y-4">
            <h2 className="text-2xl font-semibold">19. Legislação e Foro</h2>
            <p className="text-gray-700">
              Aplica-se a legislação brasileira. Fica eleito o foro da comarca
              de Fortaleza - CE, salvo disposição legal de competência diversa.
            </p>
          </article>

          {/* Voltar */}
          <div className="pt-6">
            <Link
              href="/"
              className="inline-block rounded-full bg-[#101828] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
