import { groq } from "../lib/groqClient.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body || {};
  if (!input) {
    return res.status(400).json({ error: "Missing input" });
  }

  const systemPrompt = `
You are an informational agent focused on the Jeffrey Epstein case.

Rules:
- Be neutral and factual.
- Clearly distinguish between verified facts, allegations, and unknowns.
- Do NOT promote conspiracy theories.
- If evidence is inconclusive, say so.
- Cite public institutions or court processes conceptually (no fake sources).
- Maintain a calm, academic tone.
- Avoid sensational language.

Your role is to inform, not persuade.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      temperature: 0.3
    });

    res.status(200).json({
      reply: completion.choices[0]?.message?.content || ""
    });
  } catch (err) {
    res.status(500).json({ error: "Groq error", detail: err.message });
  }
}
