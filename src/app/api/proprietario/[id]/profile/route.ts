import { NextRequest, NextResponse } from "next/server";

import { updateOwnerProfile } from "@/lib/owner-actions";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();

    console.log("Dados recebidos para atualização de perfil:", data);
    console.log("ID do proprietário:", id);

    // Validar dados básicos
    if (!data.fullName || data.fullName.trim() === "") {
      console.error("Nome completo é obrigatório");
      return NextResponse.json(
        { error: "Nome completo é obrigatório" },
        { status: 400 },
      );
    }

    const result = await updateOwnerProfile(id, data);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error("Erro da função updateOwnerProfile:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
