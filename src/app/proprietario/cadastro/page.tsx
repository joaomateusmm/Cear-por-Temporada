"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOwnerSession, saveOwnerSession } from "@/lib/owner-session";

// Schema de validação para login
const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Schema de validação para cadastro de proprietário
const registerSchema = z.object({
  fullName: z
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
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(255, "Senha deve ter no máximo 255 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function OwnerAuth() {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");

  // Selecionar imagem de background aleatoriamente
  useEffect(() => {
    const images = ["/bg-2.jpg", "/bg-3.jpg", "/bg-4.jpg", "/bg-5.jpg"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBackgroundImage(randomImage);
  }, []);

  // Verificar se o proprietário já está logado
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const session = getOwnerSession();
        if (session) {
          // Sessão válida, redireciona automaticamente
          window.location.href = `/proprietario/${session.userId}`;
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

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onLoginSubmit(values: LoginForm) {
    setIsLoginLoading(true);
    try {
      const response = await fetch("/api/proprietario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // Salva a sessão usando a função utilitária
      saveOwnerSession({
        userId: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        instagram: data.instagram,
        website: data.website,
        profileImage: data.profileImage,
      });

      // Redireciona imediatamente para o dashboard
      window.location.href = `/proprietario/${data.id}`;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      loginForm.setError("email", {
        message: errorMessage.includes("Email ou senha")
          ? "Email ou senha incorretos."
          : "Erro ao fazer login. Tente novamente.",
      });
      loginForm.setError("password", {
        message: errorMessage.includes("Email ou senha")
          ? "Email ou senha incorretos."
          : "Erro ao fazer login. Tente novamente.",
      });
    } finally {
      setIsLoginLoading(false);
    }
  }

  async function onRegisterSubmit(values: RegisterForm) {
    setIsRegisterLoading(true);
    try {
      const response = await fetch("/api/proprietario/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phone: values.phone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      // Salva a sessão usando a função utilitária
      saveOwnerSession({
        userId: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        instagram: data.instagram,
        website: data.website,
        profileImage: data.profileImage,
      });

      // Redireciona imediatamente para o dashboard
      window.location.href = `/proprietario/${data.id}`;
    } catch (error: unknown) {
      console.error("Erro ao fazer cadastro:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      if (errorMessage.includes("Email já está em uso")) {
        registerForm.setError("email", {
          message: "Este email já está cadastrado.",
        });
      } else {
        registerForm.setError("email", {
          message: "Erro ao criar conta. Tente novamente.",
        });
      }
    } finally {
      setIsRegisterLoading(false);
    }
  }

  // Tela de carregamento durante verificação de sessão
  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <div className="w-full max-w-md rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
            <p className="text-sm text-slate-300">Verificando acesso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay semi-transparente */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-yellow-300/0 to-black/50"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Container principal */}
      <div className="relative z-10 flex w-full items-center justify-between px-8">
        {/* Lado Esquerdo - Título */}
        <div className="hidden flex-1 lg:block"></div>

        {/* Lado Direito - Card do Formulário */}
        <div className="mr-32 flex w-full flex-col lg:w-[30%] lg:max-w-md">
          <h1 className="mb-6 text-center text-5xl leading-tight font-bold text-white xl:text-6xl">
            Tem um imóvel para alugar?
          </h1>
          {/* Título mobile */}
          <h1 className="mb-6 text-center text-4xl leading-tight font-bold text-white lg:hidden">
            Tem um imóvel para alugar?
          </h1>

          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            {/* Título do Card */}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2 bg-slate-100 shadow-sm">
                <TabsTrigger
                  value="login"
                  className="text-slate-600 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-slate-600 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Tab de Login */}
              <TabsContent value="login">
                <div className="space-y-4">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Digite seu email..."
                                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                                disabled={isLoginLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Senha
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showLoginPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="border-slate-300 bg-white pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                  disabled={isLoginLoading}
                                />
                                <button
                                  type="button"
                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  onClick={() =>
                                    setShowLoginPassword(!showLoginPassword)
                                  }
                                >
                                  {showLoginPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="text-md mt-6 w-full rounded-full bg-yellow-400 py-6 font-bold text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-500 hover:shadow-xl"
                        disabled={isLoginLoading}
                      >
                        {isLoginLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                          </>
                        ) : (
                          <>Entrar</>
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Link para voltar ao site */}
                  <div className="mt-6 text-center">
                    <Link
                      href="/"
                      className="text-sm text-slate-600 hover:text-slate-900"
                    >
                      ← Voltar ao site
                    </Link>
                  </div>
                </div>
              </TabsContent>

              {/* Tab de Cadastro */}
              <TabsContent value="register">
                <div className="space-y-4">
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Nome Completo
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Digite seu nome completo..."
                                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                                disabled={isRegisterLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Digite seu email..."
                                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                                disabled={isRegisterLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Telefone (opcional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="Digite seu telefone..."
                                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                                disabled={isRegisterLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Senha
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={
                                    showRegisterPassword ? "text" : "password"
                                  }
                                  placeholder="Digite sua senha..."
                                  className="border-slate-300 bg-white pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                  disabled={isRegisterLoading}
                                />
                                <button
                                  type="button"
                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  onClick={() =>
                                    setShowRegisterPassword(
                                      !showRegisterPassword,
                                    )
                                  }
                                >
                                  {showRegisterPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="mt-6 w-full rounded-full bg-yellow-400 py-6 font-bold text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-500 hover:shadow-xl"
                        disabled={isRegisterLoading}
                      >
                        {isRegisterLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando conta...
                          </>
                        ) : (
                          <>Cadastrar Imóvel</>
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Link para voltar ao site */}
                  <div className="mt-6 text-center">
                    <Link
                      href="/"
                      className="text-sm text-slate-600 hover:text-slate-900"
                    >
                      ← Voltar ao site
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
