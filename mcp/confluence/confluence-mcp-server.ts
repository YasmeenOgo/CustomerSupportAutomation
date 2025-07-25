import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const envPath = path.resolve(__dirname, '../../.env');

function parseEnv(envPath: string): { [key: string]: string } {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  const envVars: { [key: string]: string } = {};
  for (const line of envFile.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  }
  return envVars;
}

const env = parseEnv(envPath);
// console.log('[ConfluenceMCP Server] Parsed .env variables:', env);

interface SearchParams {
  query: string;
}

class ConfluenceMcpServer {
  private readonly baseUrl: string | undefined;
  private readonly email: string | undefined;
  private readonly apiToken: string | undefined;

  constructor() {
    this.baseUrl = "https://juspay.atlassian.net/wiki";
    this.email = env.ATLASSIAN_USERNAME;
    this.apiToken = env.ATLASSIAN_API_TOKEN;
    // console.log(`[ConfluenceMCP Server] Initialized with baseUrl: ${!!this.baseUrl}, email: ${!!this.email}, apiToken: ${!!this.apiToken}`);
  }

  async search({ query }: SearchParams): Promise<{ success: boolean; message: string; results?: any[] }> {
    if (!this.baseUrl || !this.email || !this.apiToken) {
      return {
        success: false,
        message: 'Confluence API credentials are not configured in the .env file.',
      };
    }

    try {
      // console.log(`[ConfluenceMCP Server] Searching for: ${query}`);
      
      const response = await axios.get(`${this.baseUrl}/rest/api/content/search`, {
        params: {
          cql: `siteSearch ~ "${query}" and space = "BZ"`,
          expand: 'body.view',
        },
        auth: {
          username: this.email,
          password: this.apiToken,
        },
      });

      const results = response.data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        url: `${this.baseUrl}${item._links.webui}`,
        excerpt: item.body.view.value.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      }));

      return {
        success: true,
        message: `Successfully found ${results.length} documents for: ${query}`,
        results,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error searching Confluence';
      console.error('[ConfluenceMCP Server] Error:', errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async getPageContent({ pageId }: { pageId: string }): Promise<{ success: boolean; message: string; content?: string }> {
    if (!this.baseUrl || !this.email || !this.apiToken) {
      return {
        success: false,
        message: 'Confluence API credentials are not configured in the .env file.',
      };
    }

    try {
      // console.log(`[ConfluenceMCP Server] Fetching content for page ID: ${pageId}`);
      
      const response = await axios.get(`${this.baseUrl}/rest/api/content/${pageId}`, {
        params: {
          expand: 'body.view',
        },
        auth: {
          username: this.email,
          password: this.apiToken,
        },
      });

      const content = response.data.body.view.value.replace(/<[^>]*>/g, '');

      return {
        success: true,
        message: `Successfully fetched content for page ID: ${pageId}`,
        content,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching page content';
      console.error('[ConfluenceMCP Server] Error:', errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async listTools() {
    return [{
      name: 'search',
      description: 'Searches for documents in Confluence',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The search query' },
        },
        required: ['query'],
      },
    },
    {
      name: 'getPageContent',
      description: 'Fetches the content of a specific Confluence page',
      parameters: {
        type: 'object',
        properties: {
          pageId: { type: 'string', description: 'The ID of the page to fetch' },
        },
        required: ['pageId'],
      },
    }];
  }
}

async function handleCommand() {
  const args = process.argv.slice(2);
  const toolName = args[0];
  const paramsFlagIndex = args.indexOf('--params');
  let params = {};

  if (paramsFlagIndex !== -1 && args[paramsFlagIndex + 1]) {
    try {
      params = JSON.parse(args[paramsFlagIndex + 1]);
    } catch (e) {
      console.error("Error parsing params JSON");
      process.exit(1);
    }
  }

  const server = new ConfluenceMcpServer();

  let result;
  if (toolName === 'search') {
    result = await server.search(params as SearchParams);
  } else if (toolName === 'getPageContent') {
    result = await server.getPageContent(params as { pageId: string });
  } else if (toolName === 'listTools') {
    result = await server.listTools();
  } else {
    result = { success: false, message: "Unknown tool" };
  }

  // Use JSON markers to clearly identify where JSON begins and ends
  console.log("---JSON_START---");
  console.log(JSON.stringify(result));
  console.log("---JSON_END---");
  process.exit(0);
}

handleCommand();
