import { Hono } from 'hono';

import { serveStatic } from 'hono/bun';
import { useOpenAIChat } from './logic/chat';

const app = new Hono();

// Serve the HTML frontend
app.use('/', serveStatic({ root: './src', path: 'index.html' }));

// other routes
app.post('/chat', useOpenAIChat);

export default app;
