import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    timestamp: new Date().toISOString(),
    database: {
      url: process.env.DATABASE_URL ? "Configurado" : "Não configurado",
    },
    message: "Debug endpoint funcionando",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      received: body,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processar request",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        environment: process.env.NODE_ENV,
      },
      { status: 500 },
    );
  }
}
