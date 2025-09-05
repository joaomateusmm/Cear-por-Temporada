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
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-400" />
            <p className="text-sm text-slate-300">Verificando sessão...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2 text-start">
          <CardTitle className="text-slate-100">
            Entrar na Área Administrativa
          </CardTitle>
          <CardDescription className="text-slate-400">
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
                    <FormLabel className="text-slate-200">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite seu email..."
                        className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
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
                    <FormLabel className="text-slate-200">Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
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
          <div className="mt-6 rounded-lg border border-blue-800 bg-blue-900/30 p-3">
            <h4 className="mb-2 text-sm font-medium text-blue-300">
              Conta de Teste:
            </h4>
            <p className="text-sm text-blue-200">
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
