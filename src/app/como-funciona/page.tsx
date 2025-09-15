"use client";

import {
  ArrowRight,
  CheckCircle,
  FileText,
  Home,
  IdCard,
  MessageCircle,
  Settings,
  Smartphone,
  Upload,
  UserPlus,
  Zap,
} from "lucide-react";
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
  const steps = [
    {
      id: 1,
      title: "Crie sua conta",
      description: "Cadastre-se gratuitamente na plataforma",
      icon: UserPlus,
      details: [
        "Acesse a área do proprietário",
        "Preencha seus dados pessoais",
        "Confirme seu email",
        "Crie uma senha segura",
      ],
    },
    {
      id: 2,
      title: "Complete seu perfil",
      description: "Adicione informações que serão vistas pelos hóspedes",
      icon: IdCard,
      details: [
        "Adicione uma foto de perfil",
        "Inclua suas redes sociais (Instagram, Website)",
        "Adicione telefone para contato",
      ],
    },
    {
      id: 3,
      title: "Cadastre seu primeiro imóvel",
      description: "Crie um anúncio completo e atrativo",
      icon: Home,
      details: [
        "Adicione fotos de alta qualidade",
        "Descreva seu imóvel detalhadamente",
        "Defina preços (diária ou mensal)",
        "Configure comodidades e serviços inclusos",
      ],
    },
    {
      id: 4,
      title: "Após isso?",
      description: "Acompanhe e edite seus anúncios no dashboard",
      icon: Settings,
      details: [
        "Visualize métricas dos seus imóveis",
        "Edite informações quando necessário",
        "Acompanhe o status de aprovação",
      ],
    },
  ];

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

      {/* Processo Passo a Passo */}
      <div className="py-16 md:mx-52">
        <div className="container mx-auto px-4 md:px-60">
          <div className="space-y-8">
            {steps.map((step) => (
              <Card
                key={step.id}
                className="overflow-hidden border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="mx-6 rounded-2xl bg-gray-800 p-8 text-white md:ml-6 md:w-1/3">
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/20">
                          <step.icon className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="text-md font-medium text-gray-200">
                            Passo {step.id}
                          </div>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-8">
                      <h4 className="mb-4 text-lg font-semibold text-gray-900">
                        O que você precisa fazer:
                      </h4>
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
