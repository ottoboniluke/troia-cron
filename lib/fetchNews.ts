export async function fetchTopNews() {
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=5&apiKey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } });
    const data = await response.json();

    if (!data.articles) {
      console.error("Erro ao buscar notícias:", data);
      return "Não foi possível buscar notícias no momento.";
    }

    const newsBlock = data.articles
      .map((art: any, index: number) => {
        return `NOTÍCIA ${index + 1}:\nTítulo: ${art.title}\nResumo: ${art.description}\nURL: ${art.url}\n---`;
      })
      .join("\n\n");

    return newsBlock;
  } catch (error) {
    console.error("Erro na requisição NewsAPI:", error);
    return "Erro técnico ao buscar notícias.";
  }
}
