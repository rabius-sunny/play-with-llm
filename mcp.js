import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { z } from 'zod';

// Create the mcp server
const server = new McpServer({
  name: 'Developer Information',
  version: '1.0.0'
});

// tool function
async function getDeveloperInfo(name) {
  try {
    const developerInfo = await import('./src/assets/developers.json');
    const developer = developerInfo.developers.find(
      (dev) => dev.name.toLowerCase() === name.toLowerCase()
    );
    if (!developer) {
      return {
        developer: 'Developer not found'
      };
    }
    return {
      developer: `Name: ${developer.name}, designation: ${
        developer.designation
      }, skilled in ${developer.skills.join(',')}. Bio: ${developer.bio}`
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}

// register the tool to mcp
server.tool(
  'getDeveloperInfoByName',
  {
    name: z.string().refine((val) => val.toLowerCase())
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(await getDeveloperInfo(name))
        }
      ]
    };
  }
);

//set transport to stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('MCP server connected');
}

main().catch((error) => {
  console.error('Error starting MCP server:', error);
  process.exit(1);
});
