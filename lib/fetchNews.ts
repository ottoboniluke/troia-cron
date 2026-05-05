export async function fetchTopNews() {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    console.warn("NEWS_API_KEY não configurada. Usando notícias de fallback.");
    return `NOTÍCIA 1: OpenAI lança novo modelo GPT-5 em fase de testes fechados.
NOTÍCIA 2: WhatsApp libera pagamento via Pix direto em conversas para todas as empresas brasileiras.
NOTÍCIA 3: Apple anuncia integração profunda de IA generativa em todo o ecossistema iOS.`;
  }

  const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=8&apiKey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } });
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return "Novidades: O mercado de IA está focado em Agentes Autônomos que operam WhatsApp e sistemas de CRM.";
    }

    const newsBlock = data.articles
      .filter((art: any) => art.title && art.title !== "[Removed]")
      .map((art: any, index: number) => {
        return `NOTÍCIA ${index + 1}:\nTitle: ${art.title}\nDescription: ${art.description}\n---`;
      })
      .join("\n\n");

    return newsBlock;
  } catch (error) {
    return "Tendências: Uso de IA para automação de atendimento e criação de conteúdo em escala para PMEs.";
  }
}
