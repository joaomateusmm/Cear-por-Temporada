import { NextRequest, NextResponse } from "next/server";

import { updatePropertyStatus } from "@/lib/property-actions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> },
) {
  try {
    const { propertyId } = await params;
    const { status } = await request.json();

    // Validar status
    if (!["ativo", "pendente"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido. Use 'ativo' ou 'pendente'" },
        { status: 400 },
      );
    }

    const result = await updatePropertyStatus(propertyId, status);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erro ao atualizar status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status atualizado para ${status}`,
    });
  } catch (error) {
    console.error("Erro ao atualizar status do imóvel:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
