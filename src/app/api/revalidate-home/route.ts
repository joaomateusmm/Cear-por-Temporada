import { revalidatePath, revalidateTag } from "next/cache";

export async function POST() {
  try {
    // Revalidar a página principal
    revalidatePath("/");

    // Revalidar tags específicas
    revalidateTag("properties");
    revalidateTag("featured-properties");
    revalidateTag("apartments");
    revalidateTag("houses");

    return Response.json({
      success: true,
      message: "Cache revalidado com sucesso",
      timestamp: new Date().toISOString(),
      revalidated: [
        "Homepage (/)",
        "Tag: properties",
        "Tag: featured-properties",
        "Tag: apartments",
        "Tag: houses",
      ],
    });
  } catch (error) {
    console.error("Erro na revalidação:", error);
    return Response.json(
      {
        error: "Erro ao revalidar cache",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return POST(); // Permitir GET também para facilitar teste no browser
}
