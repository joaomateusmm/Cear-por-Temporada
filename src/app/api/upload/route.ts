import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll("files") as File[];
    const uploadType = (data.get("type") as string) || "properties";

    console.log("Upload iniciado:", {
      filesCount: files.length,
      uploadType,
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    });

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 },
      );
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Apenas imagens são permitidas" },
          { status: 400 },
        );
      }

      // Validar tamanho do arquivo (máximo 10MB com Cloudinary)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Arquivo muito grande. Máximo 10MB" },
          { status: 400 },
        );
      }

      try {
        // Converter arquivo para buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload para Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: `ceara-por-temporada/${uploadType}`, // Organizar em pastas
                transformation: [
                  {
                    width: 1200,
                    height: 800,
                    crop: "limit",
                    quality: "auto:good",
                    format: "webp", // Converter para WebP para melhor performance
                  },
                ],
                public_id: `${uploadType}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
              },
              (error, result) => {
                if (error) {
                  console.error("Erro no upload para Cloudinary:", error);
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(buffer);
        });

        if (
          uploadResult &&
          typeof uploadResult === "object" &&
          "secure_url" in uploadResult
        ) {
          uploadedFiles.push(uploadResult.secure_url as string);
          console.log(
            "Upload bem-sucedido para Cloudinary:",
            uploadResult.secure_url,
          );
        } else {
          throw new Error("Resposta inválida do Cloudinary");
        }
      } catch (uploadError) {
        console.error("Erro no upload individual:", uploadError);
        return NextResponse.json(
          { error: `Erro ao fazer upload do arquivo ${file.name}` },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso para Cloudinary`,
      service: "cloudinary",
    });
  } catch (error) {
    console.error("Erro detalhado no upload:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
