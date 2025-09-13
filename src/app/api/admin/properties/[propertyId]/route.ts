import { NextRequest, NextResponse } from "next/server";

import { deleteProperty } from "@/lib/property-actions";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> },
) {
  try {
    const { propertyId } = await params;

    if (!propertyId) {
      return NextResponse.json(
        { error: "ID da propriedade é obrigatório" },
        { status: 400 },
      );
    }

    const result = await deleteProperty(propertyId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erro ao excluir propriedade" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Propriedade excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir propriedade:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
