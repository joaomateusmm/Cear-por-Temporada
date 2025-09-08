import { NextResponse } from "next/server";

import { getPropertiesByClass } from "@/lib/get-properties";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const className = searchParams.get("class") || "Imóvel em Destaque";

  try {
    const properties = await getPropertiesByClass(className);

    return NextResponse.json({
      success: true,
      className,
      count: properties.length,
      properties,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
