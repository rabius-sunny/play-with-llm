import { Context } from 'hono';
import OpenAI from 'openai';

export async function useOpenAIChat(c: Context) {
  const { message } = await c.req.json();
  if (!message) {
    return c.json({ error: 'No message provided.' }, 400);
  }
  const apiKey = Bun.env.OPENAI_API_KEY;
  if (!apiKey) {
    return c.json({ error: 'OpenAI API key not set.' }, 500);
  }
  const openai = new OpenAI({ apiKey });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ]
    });
    const reply = completion.choices?.[0]?.message?.content || 'No reply.';
    return c.json({ reply });
  } catch (e) {
    return c.json({ reply: 'OpenAI API error.' }, 500);
  }
}
