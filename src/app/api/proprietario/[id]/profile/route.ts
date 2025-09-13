import { NextRequest, NextResponse } from "next/server";

import { updateOwnerProfile } from "@/lib/owner-actions";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Logs que funcionam em produção (retornados na resposta em desenvolvimento)
    const debugInfo = {
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      payloadSize: JSON.stringify(data).length,
      imageSize: data.profileImage ? data.profileImage.length : 0,
      receivedId: id,
      timestamp: new Date().toISOString(),
    };

    console.log("Debug Profile Update:", debugInfo);

    // Validar dados básicos
    if (!data.fullName || data.fullName.trim() === "") {
      return NextResponse.json(
        {
          error: "Nome completo é obrigatório",
          debug: process.env.NODE_ENV === "development" ? debugInfo : undefined,
        },
        { status: 400 },
      );
    }

    // Validar tamanho da imagem em produção
    if (data.profileImage && data.profileImage.length > 100000) {
      // ~75KB base64
      return NextResponse.json(
        {
          error: "Imagem muito grande. Por favor, use uma imagem menor.",
          debug: process.env.NODE_ENV === "development" ? debugInfo : undefined,
        },
        { status: 400 },
      );
    }

    // Validar tamanho total do payload
    const payloadSize = JSON.stringify(data).length;
    if (payloadSize > 500000) {
      // 500KB total
      return NextResponse.json(
        {
          error: "Dados muito grandes. Por favor, reduza o tamanho da imagem.",
          debug: process.env.NODE_ENV === "development" ? debugInfo : undefined,
        },
        { status: 400 },
      );
    }

    const result = await updateOwnerProfile(id, data);

    if (result.success) {
      return NextResponse.json({
        success: true,
        debug: process.env.NODE_ENV === "development" ? debugInfo : undefined,
      });
    } else {
      return NextResponse.json(
        {
          error: result.error,
          debug:
            process.env.NODE_ENV === "development"
              ? { ...debugInfo, updateResult: result }
              : undefined,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    const errorInfo = {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };

    console.error("Erro ao atualizar perfil:", errorInfo);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        debug: process.env.NODE_ENV === "development" ? errorInfo : undefined,
        productionError:
          process.env.NODE_ENV === "production" ? errorInfo.message : undefined,
      },
      { status: 500 },
    );
  }
}
