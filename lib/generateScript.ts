import OpenAI from "openai";

export async function generateCarouselOptions(news: string) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API Key não encontrada nas variáveis de ambiente.");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const SYSTEM_PROMPT = `Aja como um Diretor Criativo e Estrategista de Conteúdo Sênior. Sua missão é analisar as notícias de tecnologia fornecidas e sugerir as 3 MELHORES ideias de carrossel para Instagram no estilo "Troia-Tech".

**Seu Papel:**
1. Analise o bloco de notícias fornecido.
2. Crie 3 ângulos de abordagem diferentes e altamente virais.
3. Foque em como essas notícias afetam o pequeno empresário brasileiro (PME) e como a automação com IA resolveria o problema mencionado ou aproveitaria a oportunidade.

**Para cada uma das 3 Opções, entregue:**
- **Título Chamativo (Headline):** Curta, impactante e que desperte curiosidade/medo de ficar para trás.
- **Gancho (Hook):** A primeira frase do carrossel que prende a atenção.
- **Resumo da Narrativa:** Em 2 frases, explique qual será a história contada e a lição de negócio.
- **Sugestão de Estética Visual:** Descreva brevemente o tema da imagem de capa.

**Formato de Saída (Exatamente assim):**
Opção 1: [Título]
Hook: [Texto]
História: [Texto]
Visual: [Texto]

Opção 2: [Título]
Hook: [Texto]
História: [Texto]
Visual: [Texto]

Opção 3: [Título]
Hook: [Texto]
História: [Texto]
Visual: [Texto]

Ao final, adicione: "Responda com o número da opção desejada para eu gerar o roteiro completo e as imagens."`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Aqui estão as notícias de hoje:\n${news}` },
      ],
      temperature: 0.8,
    });

    return response.choices[0].message.content || "Erro ao gerar opções.";
  } catch (error: any) {
    console.error("Erro na OpenAI:", error.message);
    throw new Error("Erro ao gerar sugestões com a OpenAI.");
  }
}
