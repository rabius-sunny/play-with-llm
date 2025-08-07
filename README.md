# E-commerce AI Chatbot

A sophisticated AI-powered chatbot for e-commerce that can understand multilingual queries, search products, make comparisons, and provide recommendations using OpenAI GPT-4o-mini.

## Features

🤖 **4-Stage AI Pipeline:**

1. **AI Query Parser** - Understands user intent in multiple languages
2. **Database Search** - Efficient product filtering and search
3. **AI Response Generator** - Natural, contextual responses
4. **Caching Layer** - Optimized performance

🔍 **Capabilities:**

- Product search with natural language
- Price range filtering
- Product comparisons
- Multilingual support (English, Hindi, Spanish, etc.)
- Smart caching for cost efficiency
- Conversation history tracking

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Add your OpenAI API key to .env
```

### 3. Start Database

```bash
bun run docker:up
```

### 4. Setup Database

```bash
# Generate migration files
bun run db:generate

# Run migrations
bun run db:migrate

# Seed with sample products
bun run db:seed
```

### 5. Start Development Server

```bash
bun run dev
```

Open http://localhost:3000

## Usage Examples

Try these queries in the chat interface:

### Basic Search

- "Show me gaming laptops under $1500"
- "मुझे 50000 rupees के अंदर smartphone चाहिए"
- "Budget headphones with good sound quality"

### Comparisons

- "Compare iPhone 15 with Samsung Galaxy S24"
- "MacBook Pro vs Dell XPS 13"

### Recommendations

- "Best laptop for college student"
- "Gaming setup for beginners"

## Architecture

```
User Input (Mixed Language)
    ↓
AI Query Parser (Extract Search Keys)
    ↓
Database Search (Traditional SQL)
    ↓
AI Response Generator (Process Results)
    ↓
Natural Response to User
```

## Database Schema

- **products** - Product catalog with name, price, specifications
- **conversations** - Chat history and analytics
- **query_cache** - Response caching for performance

## Tech Stack

- **Runtime:** Bun
- **Framework:** Hono.js
- **Database:** PostgreSQL with Drizzle ORM
- **AI:** OpenAI GPT-4o-mini
- **Frontend:** Vanilla HTML/JS with Tailwind CSS
- **Containerization:** Docker Compose

## Available Scripts

- `bun run dev` - Start development server
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:seed` - Seed database with sample products
- `bun run docker:up` - Start PostgreSQL container
- `bun run docker:down` - Stop PostgreSQL container

## API Endpoints

- `POST /chat` - Main chat endpoint
- `GET /chat/history?userId=X` - Get conversation history
- `GET /health` - Health check
- `POST /token-count` - Count tokens in text

## Cost Optimization

The system is designed for cost efficiency:

- **Caching:** Repeated queries served from cache
- **Efficient Parsing:** Minimal token usage for query parsing
- **Selective Context:** Only relevant products sent to AI
- **Fallback Patterns:** Simple keyword matching as backup

## Development

### Adding New Products

Add products directly to the database or update the seed file in `src/db/seed.ts`.

### Customizing AI Behavior

Modify prompts in:

- `src/services/queryParser.ts` - Query understanding
- `src/services/responseGenerator.ts` - Response style

### Database Changes

1. Update schema in `src/db/schema.ts`
2. Run `bun run db:generate`
3. Run `bun run db:migrate`

## Environment Variables

```env
OPENAI_API_KEY="your_openai_api_key_here"
DATABASE_URL="postgresql://admin:password123@localhost:5432/ecommerce_ai"
PORT=3000
```

## License

MIT License
