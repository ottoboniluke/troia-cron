export async function sendToWebhook(script: string) {
  const url = process.env.WEBHOOK_URL;
  
  if (!url) {
    console.warn("WEBHOOK_URL não configurada. Pulando envio.");
    return { skipped: true };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script,
        generatedAt: new Date().toISOString(),
        source: "Troia-Tech Cron Job",
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro no Webhook: ${response.statusText}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar para o Webhook:", error.message);
    throw error;
  }
}
