"use client";

import {
  ArrowRight,
  CheckCircle,
  FileText,
  Home,
  IdCard,
  MessageCircle,
  Settings,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ComoFuncionaPage() {
  const benefits = [
    {
      icon: Zap,
      title: "Cadastro Rápido",
      description: "Processo simples e intuitivo em poucos minutos",
    },
    {
      icon: Smartphone,
      title: "Totalmente Responsivo",
      description: "Gerencie seus imóveis de qualquer dispositivo",
    },
    {
      icon: MessageCircle,
      title: "Contato Direto",
      description: "Hóspedes entram em contato diretamente via WhatsApp",
    },
    {
      icon: CheckCircle,
      title: "Sem Taxas Ocultas",
      description: "Transparência total nos custos e comissões",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeaderMobile />

      {/* Hero Section */}
      <div className="bg-gray-900 py-22 text-white">
        <div className="container mx-auto px-4 text-center md:px-60">
          <h1 className="mb-4 text-4xl font-bold md:text-4xl">
            Como cadastrar meus imóveis?
          </h1>
          <p className="mb-8 text-xl text-gray-300 md:text-lg">
            Descubra como é fácil cadastrar e gerenciar seus imóveis na nossa
            plataforma
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/proprietario/cadastro">
              <Button
                size="lg"
                className="bg-slate-700 text-lg hover:bg-slate-600"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Seção: Por que escolher a SJ Imóveis */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Imagem */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/bg-3.jpg"
                  alt="Imóvel de exemplo"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Conteúdo */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl">
                Por que escolher a SJ Imóveis?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: FileText,
                    title: "Gestão Completa",
                    description:
                      "Cuidamos do aluguel e encargos como condomínio, IPTU e Taxa de Luz.",
                    color: "bg-yellow-400",
                  },
                  {
                    icon: CheckCircle,
                    title: "Análise de crédito",
                    description:
                      "Para encontrar o inquilino ideal e garantir as menores taxas de inadimplência do mercado.",
                    color: "bg-yellow-400",
                  },
                  {
                    icon: Settings,
                    title: "Setor de Embalagem",
                    description:
                      "Acompanho o estado de imóveis vagos e sugere melhorias para alugar mais rápido.",
                    color: "bg-yellow-400",
                  },
                  {
                    icon: MessageCircle,
                    title: "Ampla Divulgação",
                    description:
                      "Presença nos maiores portais imobiliários e destaque no site da SJ.",
                    color: "bg-yellow-400",
                  },
                  {
                    icon: IdCard,
                    title: "Assessoria Jurídica",
                    description:
                      "Com a Escritório Samir Jerissáti OAB 011-CE, referência em Direito Imobiliário.",
                    color: "bg-yellow-400",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${item.color}`}
                    >
                      <item.icon className="h-6 w-6 text-blue-900" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-blue-900">
                        {item.title}:
                      </h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Resultados */}
      <div className="bg-yellow-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Resultados de quem é especialista em alugar mais!
          </h2>
          <p className="mb-12 text-blue-900">
            Desde 1982, somos a maior administradora de imóveis do Ceará,
            ajudando proprietários a alugar com rapidez e segurança por meio de
            uma gestão completa, prática e sem burocracia.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                number: "+40",
                label: "ANOS",
                subtitle: "de expertise no mercado imobiliário.",
              },
              {
                number: "+8k",
                label: "IMÓVEIS",
                subtitle: "administrados no Ceará.",
              },
              {
                number: "30",
                label: "DIAS",
                subtitle: "ou menos para alugar seu imóvel.",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="border-0 bg-white shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-blue-900">
                    {stat.number}
                  </div>
                  <div className="mb-2 text-2xl font-bold text-blue-900">
                    {stat.label}
                  </div>
                  <p className="text-gray-700">{stat.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/proprietario/cadastro">
              <Button
                size="lg"
                className="bg-blue-900 text-lg font-bold hover:bg-blue-800"
              >
                Fale com nossos consultores
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Processo Passo a Passo */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
              Cadastro rápido e sem burocracias
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Cadastro do Imóvel",
                icon: Home,
              },
              {
                step: "2",
                title: "Avaliação",
                icon: CheckCircle,
              },
              {
                step: "3",
                title: "Assinatura de documentos",
                icon: FileText,
              },
              {
                step: "4",
                title: "Vistoria",
                icon: Settings,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-0 bg-white text-center shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <item.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-xl font-bold text-blue-900">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-blue-900">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/proprietario/cadastro">
              <Button
                size="lg"
                className="bg-blue-600 text-lg font-bold hover:bg-blue-700"
              >
                Cadastre seu imóvel
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Seção de Informações Detalhadas */}
      <div className="py-16 md:mx-52">
        <div className="container mx-auto px-4 md:px-60">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Informações sobre o Cadastro do Imóvel */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Cadastro do Imóvel
                </CardTitle>
                <CardDescription>
                  Informações necessárias para criar um anúncio completo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Informações Básicas
                  </h4>
                  <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-700">
                    <li>Título atrativo do imóvel</li>
                    <li>Descrição completa</li>
                    <li>Número de quartos, banheiros e hóspedes</li>
                    <li>Área em m² (opcional)</li>
                    <li>Aceita pets?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Localização</h4>
                  <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-700">
                    <li>Endereço completo</li>
                    <li>Bairro, cidade e CEP</li>
                    <li>Destino popular próximo</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Preços e Serviços
                  </h4>
                  <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-700">
                    <li>Valor da diária ou aluguel mensal</li>
                    <li>Taxa de limpeza mensal</li>
                    <li>Serviços inclusos (água, luz, internet, etc.)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Informações sobre Fotos */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Upload className="h-6 w-6 text-blue-600" />
                  Dicas para Fotos
                </CardTitle>
                <CardDescription>
                  Como fazer fotos que atraem mais hóspedes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Fotos Essenciais
                  </h4>
                  <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-700">
                    <li>Fachada ou entrada principal</li>
                    <li>Sala de estar e área social</li>
                    <li>Todos os quartos</li>
                    <li>Banheiros</li>
                    <li>Cozinha completa</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Dicas de Qualidade
                  </h4>
                  <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-700">
                    <li>Use luz natural sempre que possível</li>
                    <li>Mantenha o ambiente limpo e organizado</li>
                    <li>Tire fotos de diferentes ângulos</li>
                    <li>Evite fotos com pessoas</li>
                    <li>Resolução mínima de 1080p</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-800">
                    <strong>Dica:</strong> Imóveis com mais fotos e melhor
                    qualidade recebem até 40% mais visualizações!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Vantagens da Plataforma */}
      <div className="py-16 md:mx-52">
        <div className="container mx-auto px-4 md:px-60">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-lg text-gray-600">
              Benefícios exclusivos para proprietários
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="cursor-default border-gray-200 text-center shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <benefit.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Rápido */}
      <div className="py-16 md:mx-52">
        <div className="container mx-auto px-4 md:px-60">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="cursor-default border-gray-200 shadow-sm duration-500 hover:scale-[1.02] hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Quanto custa para cadastrar?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  O cadastro é totalmente gratuito! Você só paga uma pequena
                  comissão quando efetivamente receber uma reserva.
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-default border-gray-200 shadow-sm duration-500 hover:scale-[1.02] hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Como funciona o contato com hóspedes?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Os interessados entram em contato diretamente com você via
                  WhatsApp. Você tem controle total sobre suas reservas.
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-default border-gray-200 shadow-sm duration-500 hover:scale-[1.02] hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Posso editar meu anúncio depois?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Sim! Você pode editar todas as informações do seu imóvel a
                  qualquer momento através do seu dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-default border-gray-200 shadow-sm duration-500 hover:scale-[1.02] hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Quanto tempo para aprovação?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Anúncios completos são aprovados em até 24 horas. Você será
                  notificado por email quando estiver ativo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
