"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
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
import { loginAdmin } from "@/lib/admin-actions";
import { getAdminSession, saveAdminSession } from "@/lib/admin-session";

// Schema de validação para login de administrador
const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const session = getAdminSession();
        if (session) {
          // Sessão válida, redireciona automaticamente
          window.location.href = `/admin/${session.userId}`;
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();
  }, []);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginForm) {
    setIsLoading(true);
    try {
      const user = await loginAdmin({
        email: values.email,
        password: values.password,
      });

      // Salva a sessão usando a função utilitária
      saveAdminSession(user);

      // Redireciona imediatamente para o dashboard
      window.location.href = `/admin/${user.id}`;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      form.setError("email", {
        message: "Email ou senha incorretos.",
      });
      form.setError("password", {
        message: "Email ou senha incorretos.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Tela de carregamento durante verificação de sessão
  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Verificando sessão...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-start">
          <CardTitle>Entrar na Área Administrativa</CardTitle>
          <CardDescription>
            Faça login para acessar o painel de gerenciamento de imóveis do
            Ceará por Temporada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite seu email..."
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
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Informações para teste */}
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              Conta de Teste:
            </h4>
            <p className="text-sm text-blue-700">
              <strong>Email:</strong> test1@gmail.com
              <br />
              <strong>Senha:</strong> 13IAmb13
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
