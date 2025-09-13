"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAdminUser } from "@/lib/admin-actions";

// Schema de validação para criação de conta de administrador
const createAccountSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(255, "Senha deve ter no máximo 255 caracteres"),
});

type CreateAccountForm = z.infer<typeof createAccountSchema>;

interface CreateAccountPageProps {
  params: Promise<{
    adminId: string;
  }>;
}

export default function CreateAccountPage({ params }: CreateAccountPageProps) {
  const { adminId } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const form = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: CreateAccountForm) {
    setIsLoading(true);
    try {
      const newUser = await createAdminUser({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        password: values.password,
      });

      setCreatedUser(newUser);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (
        error instanceof Error &&
        error.message.includes("Email já está em uso")
      ) {
        form.setError("email", {
          message: "Este email já está sendo usado por outra conta.",
        });
      } else {
        form.setError("email", {
          message: "Erro ao criar conta. Tente novamente.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess && createdUser) {
    return (
      <div className="mt-32 space-y-6 md:mx-52">
        {/* Header da página */}
        <div className="">
          {/* Layout para mobile */}
          <div className="block md:hidden">
            <Link
              href={`/admin/${adminId}/accounts`}
              className="mb-4 inline-block"
            >
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="mb-4 text-2xl font-bold text-slate-100">
              Conta Criada com Sucesso!
            </h1>
          </div>

          {/* Layout para desktop */}
          <div className="hidden md:block">
            <h1 className="mb-4 text-2xl font-bold text-slate-100">
              Conta Criada com Sucesso!
            </h1>
            <div className="flex flex-row items-center gap-8">
              <Link href={`/admin/${adminId}/accounts`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <p className="text-slate-300">
                A conta administrativa foi criada com sucesso
              </p>
            </div>
          </div>
        </div>

        {/* Card de sucesso */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-600/50 bg-green-800/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <CardTitle className="text-green-400">Conta Criada!</CardTitle>
            <CardDescription className="text-slate-300">
              A conta administrativa foi criada com sucesso e já pode ser usada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-green-600/30 bg-green-800/10 p-4">
              <h4 className="mb-3 text-sm font-medium text-green-400">
                Dados da Conta:
              </h4>
              <div className="space-y-2 text-sm text-slate-200">
                <p>
                  <strong className="text-slate-300">ID:</strong>{" "}
                  {createdUser.id}
                </p>
                <p>
                  <strong className="text-slate-300">Nome:</strong>{" "}
                  {createdUser.name}
                </p>
                <p>
                  <strong className="text-slate-300">Email:</strong>{" "}
                  {createdUser.email}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Link href={`/admin/${adminId}/accounts`}>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Ver Todas as Contas
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                onClick={() => {
                  setIsSuccess(false);
                  setCreatedUser(null);
                }}
              >
                Criar Outra Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-32 space-y-6 md:mx-52">
      {/* Header da página */}
      <div className="">
        {/* Layout para mobile */}
        <div className="block md:hidden">
          <Link
            href={`/admin/${adminId}/accounts`}
            className="mb-4 inline-block"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="mb-4 text-2xl font-bold text-slate-100">
            Criar Conta de Administrador
          </h1>
          <p className="text-slate-300">
            Crie uma nova conta para gerenciar imóveis na plataforma
          </p>
        </div>

        {/* Layout para desktop */}
        <div className="hidden md:block">
          <h1 className="mb-4 text-2xl font-bold text-slate-100">
            Criar Conta de Administrador
          </h1>
          <div className="flex flex-row items-center gap-8">
            <Link href={`/admin/${adminId}/accounts`}>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <p className="text-slate-300">
              Crie uma nova conta para gerenciar imóveis na plataforma
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <CardTitle className="text-slate-100">Dados da Nova Conta</CardTitle>
          <CardDescription className="text-slate-400">
            Preencha os dados abaixo para criar uma nova conta de administrador.
            Esta conta poderá gerenciar imóveis na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Nome Completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo..."
                          {...field}
                          disabled={isLoading}
                          className="border-slate-600 bg-slate-700 text-slate-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite o email..."
                          {...field}
                          disabled={isLoading}
                          className="border-slate-600 bg-slate-700 text-slate-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Telefone (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(85) 99999-9999"
                          {...field}
                          disabled={isLoading}
                          className="border-slate-600 bg-slate-700 text-slate-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="border-slate-600 bg-slate-700 text-slate-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <Link href={`/admin/${adminId}/accounts`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600 sm:w-auto"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </Link>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
