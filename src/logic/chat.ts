import { Context } from 'hono';
import { ChatService } from '../services/chat';

const chatService = new ChatService();

export async function useOpenAIChat(c: Context) {
  try {
    const { message, userId } = await c.req.json();

    if (!message) {
      return c.json({ error: 'No message provided.' }, 400);
    }

    const apiKey = Bun.env.OPENAI_API_KEY;
    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not set.' }, 500);
    }

    // Process the query through our 4-stage pipeline
    const result = await chatService.processQuery(message, userId);

    return c.json({
      reply: result.response,
      metadata: {
        parsedQuery: result.parsedQuery,
        productCount: result.productCount,
        cached: result.cached
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json(
      {
        reply: 'I apologize, but I encountered an error. Please try again.',
        error: 'Internal server error'
      },
      500
    );
  }
}

export async function getChatHistory(c: Context) {
  try {
    const userId = c.req.query('userId');
    const limit = parseInt(c.req.query('limit') || '10');

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    const history = await chatService.getConversationHistory(userId, limit);
    return c.json({ history });
  } catch (error) {
    console.error('Get chat history error:', error);
    return c.json({ error: 'Failed to get chat history' }, 500);
  }
}
