import { Context } from 'hono';
import { encode } from 'gpt-3-encoder';
import { encoding_for_model } from '@dqbd/tiktoken';

export async function getTokenCount(c: Context) {
  const { text } = await c.req.json();
  if (!text) {
    return c.json({ error: 'No text provided.' }, 400);
  }

  const enc = encoding_for_model('gpt-4o-mini');

  const tokensDetails = enc.encode(text);
  const tokensShort = encode(text);

  return c.json({
    shortCount: tokensShort.length,
    longCount: tokensDetails.length
  });
}
