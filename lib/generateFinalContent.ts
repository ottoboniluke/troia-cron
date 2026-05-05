import OpenAI from "openai";

export async function generateFinalCarousel(optionText: string) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;
  const openai = new OpenAI({ apiKey });

  const SYSTEM_PROMPT = `Você é o estrategista de conteúdo sênior da persona "Troia-Tech".
Sua missão é transformar a opção escolhida em um roteiro de carrossel de 7 slides de altíssimo impacto para Instagram.

**Identidade Troia-Tech:**
- Educativo porém divertido (Edutainment).
- Tom sofisticado de "Old Money" misturado com gírias de empresário real ("bucha", "sem braço", "rodar no manual").
- Sempre conecte a história com a Automação e IA como a solução salvadora.

**Estrutura de slides obrigatória:**
Slide 1: Headline matadora + Gancho.
Slide 2-5: Desenvolvimento da história e a dor do empresário.
Slide 6: O contraste (Como a IA resolve isso agora).
Slide 7: CTA (Chamada para ação - Comente "AUTOMAÇÃO").

**Saída esperada:**
Retorne o roteiro separado por slides e, ao final, inclua um prompt para o DALL-E 3 em INGLÊS que ilustre a capa de forma luxuosa e cinematográfica (sem textos na imagem).`;

  try {
    // 1. Gerar Roteiro
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `A opção escolhida foi: ${optionText}. Por favor, gere o roteiro final.` },
      ],
      temperature: 0.7,
    });

    const script = chatCompletion.choices[0].message.content || "";

    // 2. Extrair Prompt para o DALL-E (Simples busca por texto ou gerar um novo baseado no script)
    const imagePromptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Extraia ou crie um prompt para o DALL-E 3 baseado no roteiro fornecido. O prompt deve ser em INGLÊS, focado em luxo, estética 35mm, cinematográfico e SEM TEXTOS." },
        { role: "user", content: script },
      ],
    });

    const imagePrompt = imagePromptResponse.choices[0].message.content || "Luxury high tech office, cinematic lighting, 35mm film style";

    // 3. Gerar Imagem com DALL-E 3
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
    });

    return {
      script,
      imageUrl: imageResponse.data[0].url,
    };
  } catch (error: any) {
    console.error("Erro na geração final:", error.message);
    throw new Error("Falha ao gerar conteúdo final.");
  }
}
