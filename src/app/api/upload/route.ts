import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll("files") as File[];
    const uploadType = (data.get("type") as string) || "properties";

    // Detectar ambiente
    const isProduction = process.env.NODE_ENV === "production";
    const isVercel = process.env.VERCEL === "1";

    console.log("Upload iniciado:", {
      filesCount: files.length,
      uploadType,
      isProduction,
      isVercel,
      environment: process.env.NODE_ENV,
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    });

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 },
      );
    }

    // Em produção (especialmente Vercel), usar estratégia alternativa
    if (isProduction || isVercel) {
      // Converter para base64 e retornar data URL (solução temporária)
      const processedFiles: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          return NextResponse.json(
            { error: "Apenas imagens são permitidas" },
            { status: 400 },
          );
        }

        // Validar tamanho do arquivo (máximo 1MB para base64 em produção)
        if (file.size > 1 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Arquivo muito grande. Máximo 1MB em produção" },
            { status: 400 },
          );
        }

        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const dataUrl = `data:${file.type};base64,${base64}`;

        processedFiles.push(dataUrl);
      }

      return NextResponse.json({
        success: true,
        urls: processedFiles,
        message: `${processedFiles.length} arquivo(s) processado(s) com sucesso (modo produção)`,
        mode: "base64",
      });
    }

    const uploadedFiles: string[] = [];

    // Caminho onde os arquivos serão salvos - dinamico baseado no tipo
    const subDir = uploadType === "profiles" ? "profiles" : "properties";
    const uploadsDir = path.join(process.cwd(), "public", "uploads", subDir);

    console.log("Diretório de upload:", uploadsDir);

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

      // Gerar nome único para o arquivo - baseado no tipo
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.name);
      const prefix = uploadType === "profiles" ? "profile" : "property";
      const fileName = `${prefix}_${timestamp}_${randomSuffix}${fileExtension}`;

      console.log("Salvando arquivo:", fileName);

      const filePath = path.join(uploadsDir, fileName);

      // Salvar o arquivo
      await writeFile(filePath, buffer);

      // Adicionar à lista de arquivos enviados (caminho relativo para o frontend)
      uploadedFiles.push(`/uploads/${subDir}/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedFiles,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`,
    });
  } catch (error) {
    console.error("Erro detalhado no upload:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Erro desconhecido",
    );

    // Log mais detalhado para debug
    if (error instanceof Error) {
      console.error("Nome do erro:", error.name);
      console.error("Mensagem do erro:", error.message);
    }

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
