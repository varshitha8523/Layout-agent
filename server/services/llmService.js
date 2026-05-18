import Groq from 'groq-sdk';
import 'dotenv/config';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function callLLM(systemPrompt, history, userMessage) {
  const messages = [
    { role: 'system', content: systemPrompt + '\n\nRespond ONLY with a valid JSON object, no markdown, no extra text.' },
    ...history.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    })),
    { role: 'user', content: userMessage }
  ];

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 4096,
    messages,
  });

  const rawText = response.choices[0].message.content;

  const cleaned = rawText
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        throw new Error('Could not parse JSON: ' + rawText.substring(0, 200));
      }
    } else {
      throw new Error('No JSON found in response: ' + rawText.substring(0, 200));
    }
  }

  // Normalize — handle model returning layout directly without wrapper
  if (!parsed.updatedLayout) {
    if (parsed.nodes && parsed.rootNodes) {
      parsed = {
        updatedLayout: parsed,
        explanation: parsed.explanation || 'Layout updated.'
      };
    } else {
      throw new Error('Response missing updatedLayout');
    }
  }

  if (!parsed.explanation) parsed.explanation = 'Layout updated.';

  return parsed;
}