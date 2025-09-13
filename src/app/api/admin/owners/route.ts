import { NextRequest, NextResponse } from "next/server";

import {
  bulkDeleteOwners,
  bulkToggleOwnerStatus,
  deleteOwner,
  getAllOwners,
  toggleOwnerStatus,
} from "@/lib/admin-actions";

export async function GET() {
  try {
    const owners = await getAllOwners();
    return NextResponse.json(owners);
  } catch (error) {
    console.error("Erro ao buscar proprietários:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ownerId, ownerIds, isActive } = body;

    switch (action) {
      case "toggle-status":
        if (!ownerId || typeof isActive !== "boolean") {
          return NextResponse.json(
            { error: "ID do proprietário e status são obrigatórios" },
            { status: 400 },
          );
        }
        const updatedOwner = await toggleOwnerStatus(ownerId, isActive);
        return NextResponse.json(updatedOwner);

      case "bulk-toggle-status":
        if (!Array.isArray(ownerIds) || typeof isActive !== "boolean") {
          return NextResponse.json(
            { error: "IDs dos proprietários e status são obrigatórios" },
            { status: 400 },
          );
        }
        const updatedOwners = await bulkToggleOwnerStatus(ownerIds, isActive);
        return NextResponse.json(updatedOwners);

      default:
        return NextResponse.json(
          { error: "Ação não reconhecida" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Erro ao atualizar proprietário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ownerId, ownerIds } = body;

    if (ownerIds && Array.isArray(ownerIds)) {
      // Exclusão em massa
      const deletedOwners = await bulkDeleteOwners(ownerIds);
      return NextResponse.json(deletedOwners);
    } else if (ownerId) {
      // Exclusão individual
      const deletedOwner = await deleteOwner(ownerId);
      return NextResponse.json(deletedOwner);
    } else {
      return NextResponse.json(
        { error: "ID do proprietário é obrigatório" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Erro ao excluir proprietário:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
