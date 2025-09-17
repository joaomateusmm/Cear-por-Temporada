import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAdminSessionFromCookie } from "@/lib/admin-session";

export function middleware(request: NextRequest) {
  // Verificar se está tentando acessar área administrativa
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Permitir acesso à página de login sem autenticação
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Verificar se existe uma sessão administrativa válida
    const cookieHeader = request.headers.get("cookie");
    const adminSession = getAdminSessionFromCookie(cookieHeader || "");

    if (!adminSession) {
      // Não autenticado, redirecionar para login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verificar se o usuário está tentando acessar o dashboard correto
    const pathSegments = request.nextUrl.pathname.split("/");
    if (
      pathSegments.length > 2 &&
      pathSegments[2] !== adminSession.userId.toString()
    ) {
      // Usuário tentando acessar dashboard de outro admin
      return NextResponse.redirect(
        new URL(`/admin/${adminSession.userId}`, request.url),
      );
    }

    // Autenticado, adicionar headers com informações da sessão
    const response = NextResponse.next();
    response.headers.set("X-Admin-Area", "true");
    response.headers.set("X-Admin-User-Id", adminSession.userId.toString());
    response.headers.set("X-Admin-User-Email", adminSession.userEmail);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplicar middleware apenas nas rotas administrativas
    "/admin/:path*",
  ],
};
