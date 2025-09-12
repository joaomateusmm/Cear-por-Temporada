import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 },
      );
    }

    const uploadedFiles: string[] = [];

    // Caminho onde os arquivos serão salvos
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "properties",
    );

    // Criar diretório se não existir
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Apenas imagens são permitidas" },
          { status: 400 },
        );
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Arquivo muito grande. Máximo 5MB" },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.name);
      const fileName = `property_${timestamp}_${randomSuffix}${fileExtension}`;

      const filePath = path.join(uploadsDir, fileName);

      // Salvar o arquivo
      await writeFile(filePath, buffer);

      // Adicionar à lista de arquivos enviados (caminho relativo para o frontend)
      uploadedFiles.push(`/uploads/properties/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedFiles,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
