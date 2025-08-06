import { Hono } from 'hono';

import { serveStatic } from 'hono/bun';
import OpenAI from 'openai';

const app = new Hono();

// Serve the HTML frontend
app.use('/', serveStatic({ root: './src', path: 'index.html' }));

app.post('/chat', async (c) => {
  const { message } = await c.req.json();
  const apiKey = Bun.env.OPENAI_API_KEY;
  if (!apiKey) {
    return c.json({ reply: 'OpenAI API key not set.' }, 500);
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
});

export default app;
