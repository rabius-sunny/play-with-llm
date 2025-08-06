import { Hono } from 'hono';

import { serveStatic } from 'hono/bun';
import { useOpenAIChat } from './logic/chat';
import { getTokenCount } from './logic/token';

const app = new Hono();

// Serve the HTML frontend
app.use('/', serveStatic({ root: './src', path: 'index.html' }));

// other routes
app.post('/chat', useOpenAIChat);
app.post('/token-count', getTokenCount);

export default app;
