import { executeMCPCommand } from '../src/mcp-utils';

/**
 * Fetches data from external tools based on the query.
 * @param {string} queryText - The text of the customer's query.
 * @returns {Promise<string>}
 */
export async function getToolResponse(queryText: string): Promise<string> {
  try {
    const searchResponse = await executeMCPCommand('confluence', 'search', { query: queryText });
    if (searchResponse && searchResponse.results && searchResponse.results.length > 0) {
      const topResult = searchResponse.results[0];
      
      const contentResponse = await executeMCPCommand('confluence', 'getPageContent', { pageId: topResult.id });
      if (contentResponse && contentResponse.success) {
        return `Confluence Tool: Found document "${topResult.title}"\n\n${contentResponse.content}`;
      } else {
        return `Confluence Tool: Found document "${topResult.title}" but could not fetch the content.`;
      }
    }
    return 'No relevant documents found in Confluence.';
  } catch (error) {
    console.error('Error fetching from Confluence MCP:', error);
    return 'Error connecting to the Confluence tool.';
  }
}
