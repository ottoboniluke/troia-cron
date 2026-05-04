import { NextRequest, NextResponse } from "next/server";
import { fetchTopNews } from "@/lib/fetchNews";
import { generateCarouselScript } from "@/lib/generateScript";
import { sendToWebhook } from "@/lib/sendWebhook";

export async function GET(request: NextRequest) {
  // 1. Verificação de Segurança (Bearer Token)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    console.log("Iniciando Cron Job: Busca de notícias...");
    const news = await fetchTopNews();

    console.log("Gerando roteiro com GPT-4o...");
    const script = await generateCarouselScript(news);

    console.log("Enviando para o Webhook...");
    await sendToWebhook(script);

    console.log("Processo concluído com sucesso!");

    return NextResponse.json({
      success: true,
      message: "Roteiro enviado para o webhook",
    });

  } catch (error: any) {
    console.error("Erro no Cron Job:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
