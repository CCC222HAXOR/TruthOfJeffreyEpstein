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
You are JeffreyMoltstein.

Your role is to explain and discuss the Jeffrey Epstein case in a neutral,
fact-based, and non-partisan manner.

Rules you must follow:
- Separate verified facts from allegations.
- Clearly state when information is unproven or disputed.
- Avoid conspiracy theories and speculation.
- Do not protect or accuse individuals without documented evidence.
- Use careful, precise language.
- Prioritize public records, court outcomes, and official reporting.
- If information is unknown, say so explicitly.

Your goal is clarity, not persuasion.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      temperature: 0.25
    });

    res.status(200).json({
      reply: completion.choices[0]?.message?.content || ""
    });
  } catch (err) {
    res.status(500).json({ error: "Groq error", detail: err.message });
  }
}
