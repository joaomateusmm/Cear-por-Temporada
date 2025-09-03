"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, UserPlus } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Conta Criada!</CardTitle>
            <CardDescription>
              A conta administrativa foi criada com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <h4 className="mb-2 text-sm font-medium text-green-800">
                Dados da Conta:
              </h4>
              <p className="text-sm text-green-700">
                <strong>ID:</strong> {createdUser.id}
                <br />
                <strong>Nome:</strong> {createdUser.name}
                <br />
                <strong>Email:</strong> {createdUser.email}
              </p>
            </div>

            <div className="space-y-2">
              <Link href={`/admin/${adminId}/accounts`}>
                <Button className="w-full">Ver Todas as Contas</Button>
              </Link>

              <Button
                variant="outline"
                className="w-full"
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-start">
          <CardTitle>Criar Conta de Administrador</CardTitle>
          <CardDescription>
            Crie uma nova conta para que outro usuário possa gerenciar imóveis
            na plataforma Ceará por Temporada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome completo..."
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite o email..."
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(85) 99999-9999"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
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
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Link href={`/admin/${adminId}/accounts`}>
              <Button variant="ghost" size="sm">
                Voltar para Contas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
