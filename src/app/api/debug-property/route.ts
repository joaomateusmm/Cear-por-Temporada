import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Debug Property Creation - Data received:", {
      keys: Object.keys(data),
      ownerId: data.ownerId,
      title: data.title,
      hasImages: data.images?.length > 0,
      hasAmenities: data.amenities?.length > 0,
      propertyClasses: data.propertyClasses,
    });

    // Verificar se todos os campos necessários estão presentes
    const requiredFields = [
      "title",
      "shortDescription",
      "maxGuests",
      "bedrooms",
      "bathrooms",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Campos obrigatórios faltando",
          missingFields,
          debug: true,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      debug: true,
      receivedData: {
        ownerId: data.ownerId,
        title: data.title,
        fieldsCount: Object.keys(data).length,
      },
    });
  } catch (error) {
    console.error("Debug Property Creation Error:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
        debug: true,
      },
      { status: 500 },
    );
  }
}
