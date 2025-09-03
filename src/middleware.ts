import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Verificar se está tentando acessar área administrativa
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Por enquanto, vamos apenas adicionar um header de aviso
    // Futuramente aqui você pode implementar autenticação real
    const response = NextResponse.next();

    response.headers.set("X-Admin-Area", "true");

    // TODO: Implementar verificação de autenticação aqui
    // if (!isAuthenticated) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }

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
