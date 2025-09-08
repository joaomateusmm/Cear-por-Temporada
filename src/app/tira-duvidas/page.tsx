"use client";

import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TiraDuvidasPage() {
  const faqs = [
    {
      question: "Como faço para reservar um imóvel?",
      answer:
        "Navegue pelos imóveis disponíveis, clique em 'Ver Detalhes' para mais informações e entre em contato através do WhatsApp ou telefone informado. Nossa equipe auxiliará você em todo o processo de reserva.",
    },
    {
      question: "O site é seguro para fazer reservas?",
      answer:
        "Sim! Trabalhamos apenas com proprietários verificados e nossos processos seguem rigorosos padrões de segurança. Todas as informações são validadas e mantemos canais oficiais de comunicação para sua proteção.",
    },
    {
      question: "Posso levar meu pet para os imóveis?",
      answer:
        "Isso varia por imóvel. Muitos de nossos anúncios indicam se aceita pets ou não. Verifique essa informação na descrição do imóvel ou confirme diretamente com nossa equipe antes da reserva.",
    },
    {
      question: "Quais são as formas de pagamento aceitas?",
      answer:
        "As formas de pagamento variam por proprietário e podem incluir PIX, transferência bancária, cartão de crédito ou dinheiro. As condições específicas serão informadas durante o processo de reserva.",
    },
    {
      question: "Posso cancelar minha reserva?",
      answer:
        "Sim, mas as políticas de cancelamento variam por imóvel e situação. Recomendamos entrar em contato conosco o quanto antes para discutir as melhores opções para sua situação específica.",
    },
    {
      question: "Como denunciar um anúncio suspeito?",
      answer:
        "Se encontrar algum anúncio inadequado ou suspeito, entre em contato conosco imediatamente através do WhatsApp ou email oficial. Investigamos todas as denúncias e tomamos as medidas necessárias.",
    },
    {
      question: "Como posso adicionar meu imóvel à plataforma?",
      answer:
        "Entre em contato conosco através dos canais oficiais para iniciar o processo de cadastro. Nossa equipe fará uma avaliação e, se aprovado, auxiliará no cadastro completo do seu imóvel.",
    },
    {
      question: "Há taxa de limpeza ou outras taxas adicionais?",
      answer:
        "Taxas adicionais como limpeza, caução ou serviços extras variam por imóvel e são informadas claramente na descrição ou durante a negociação. Sempre deixamos todas as taxas transparentes antes da confirmação.",
    },
    {
      question: "Como funciona o depósito de caução?",
      answer:
        "Quando aplicável, a caução é um valor temporário para garantir a conservação do imóvel. Os valores e condições são específicos para cada propriedade e serão detalhados durante a reserva.",
    },
    {
      question: "Vocês oferecem suporte durante a estadia?",
      answer:
        "Sim! Mantemos canais de comunicação disponíveis para auxiliar em questões durante sua estadia. Em emergências, temos procedimentos específicos para garantir seu conforto e segurança.",
    },
    {
      question: "Os endereços exatos são mostrados no site?",
      answer:
        "Por segurança, mostramos a localização por bairro/região no site. O endereço completo é compartilhado após a confirmação da reserva e pagamento, seguindo nossas políticas de segurança.",
    },
    {
      question: "Como funcionam os imóveis em destaque?",
      answer:
        "Os destaques ('Imóvel em Destaque', 'Destaque em Casas', etc.) são selecionados com base em critérios como qualidade, localização, avaliações e demanda. Representam nossas recomendações especiais.",
    },
    {
      question: "Qual a diferença entre locação mensal e temporada?",
      answer:
        "Locação por temporada é para períodos mais curtos (dias/semanas), ideal para férias. Locação mensal é para estadias prolongadas (30+ dias), com condições e preços diferenciados para cada modalidade.",
    },
    {
      question: "Posso visitar o imóvel antes de confirmar a reserva?",
      answer:
        "Dependendo da disponibilidade e localização, pode ser possível agendar uma visita. Entre em contato conosco para verificar essa possibilidade para o imóvel de seu interesse.",
    },
    {
      question: "O que fazer se tiver problemas durante a estadia?",
      answer:
        "Entre em contato imediatamente através dos nossos canais oficiais. Temos protocolos específicos para diferentes tipos de situações e nossa equipe trabalhará para resolver qualquer problema rapidamente.",
    },
  ];

  return (
    <>
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
        <main className="pt-16 md:mx-40">
          {/* Hero Section */}
          <section className="mx-6 mt-6 rounded-2xl bg-[#101828] py-10 md:mx-40">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mb-6 flex justify-center">
                <MessageCircleQuestion className="h-16 w-16 text-white" />
              </div>
              <h1 className="mb-3 text-2xl font-bold text-white">
                Tira Dúvidas
              </h1>
              <p className="text-md text-gray-300">
                Encontre respostas para as principais dúvidas sobre hospedagens
                no Ceará
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="space-y-8">
                {/* Introdução */}
                <div className="text-center">
                  <h2 className="mb-4 text-3xl font-semibold text-[#101828] md:text-4xl">
                    Perguntas Frequentes
                  </h2>
                  <p className="text-lg text-gray-700">
                    Não encontrou sua resposta? Entre em contato conosco!
                  </p>
                </div>

                {/* Accordion FAQ */}
                <div className="rounded-lg bg-gray-100 p-6 shadow-lg md:mx-40 md:p-8">
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="rounded-lg border border-gray-200 bg-white px-6"
                      >
                        <AccordionTrigger className="text-left font-semibold text-[#101828] hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="leading-relaxed text-gray-700">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Call to Action */}
                <div className="text-center md:mx-40">
                  <div className="rounded-lg bg-[#101828] px-8 py-12">
                    <h3 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
                      Ainda tem dúvidas?
                    </h3>
                    <p className="mb-6 text-gray-300">
                      Nossa equipe está pronta para ajudar você a encontrar a
                      hospedagem perfeita
                    </p>
                    <Link
                      href="/"
                      className="inline-block rounded-full bg-gray-100 px-8 py-3 font-semibold text-[#101828] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
    </>
  );
}
