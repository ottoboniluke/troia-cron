import { NextRequest, NextResponse } from "next/server";
import { generateFinalCarousel } from "@/lib/generateFinalContent";

export async function POST(request: NextRequest) {
  // 1. Segurança básica
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const { optionText } = await request.json();

    if (!optionText) {
      return NextResponse.json({ success: false, error: "Texto da opção não fornecido." }, { status: 400 });
    }

    console.log("Gerando carrossel completo para:", optionText);
    const result = await generateFinalCarousel(optionText);

    return NextResponse.json({
      success: true,
      script: result.script,
      imageUrl: result.imageUrl
    });

  } catch (error: any) {
    console.error("Erro na rota generate-final:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
