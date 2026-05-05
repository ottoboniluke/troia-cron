export async function fetchTopNews() {
  const apiKey = process.env.NEWS_API_KEY;
  // Buscando notícias globais (mais volume) e permitindo que o GPT as processe
  const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=8&apiKey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } });
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      console.warn("Nenhuma notícia encontrada pela API.");
      return "Foco no dia de hoje: Novidades em Automação de Processos e Inteligência Artificial Generativa para negócios.";
    }

    const newsBlock = data.articles
      .filter((art: any) => art.title && art.title !== "[Removed]")
      .map((art: any, index: number) => {
        return `NOTÍCIA ${index + 1}:\nTitle: ${art.title}\nDescription: ${art.description}\nURL: ${art.url}\n---`;
      })
      .join("\n\n");

    return newsBlock;
  } catch (error) {
    console.error("Erro na requisição NewsAPI:", error);
    return "Tendências: Agentes de IA para WhatsApp, Automação de Funis de Vendas e Otimização de Processos com No-Code.";
  }
}
