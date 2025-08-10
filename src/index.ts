import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { useOpenAIChat, getChatHistory } from './logic/chat';
import { getTokenCount } from './logic/token';
import { clearCache } from './logic/cache';

const app = new Hono();

// Enable CORS for all routes
app.use('*', cors());

// Serve the HTML frontend
app.use('/', serveStatic({ root: './src', path: 'index.html' }));
app.use('/static/*', serveStatic({ root: './src' }));

// API routes
app.post('/chat', useOpenAIChat);
app.get('/clear-cache', clearCache);
app.get('/chat/history', getChatHistory);
app.post('/token-count', getTokenCount);

// Health check
app.get('/health', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() })
);

console.log('Starting E-commerce AI Chatbot server...');
console.log('Environment check:');
console.log('- OpenAI API Key:', Bun.env.OPENAI_API_KEY ? 'Set' : 'Not set');
console.log('- Database URL:', Bun.env.DATABASE_URL || 'Using default');

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch
};
