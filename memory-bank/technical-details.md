# Technical Details

## Project Structure:

*   **`src/`**: Contains the main application logic, written in TypeScript.
    *   **`index.ts`**: The main entry point of the application.
    *   **`support-handler.ts`**: Handles the core logic of processing user queries.
    *   **`query-classifier.ts`**: Classifies queries as simple or complex.
    *   **`model-selector.ts`**: Selects the appropriate AI model based on query complexity.
    *   **`mcp-utils.ts`**: Provides a utility function for executing commands on MCP servers.
*   **`tools/`**: Contains tools that the application can use.
    *   **`tool-registry.ts`**: The registry for all available tools.
*   **`mcp/`**: Contains the MCP servers.
    *   **`confluence/`**: The MCP server for interacting with Confluence.
*   **`memory-bank/`**: Contains markdown files with project context and technical details.
*   **`dist/`**: Contains the compiled JavaScript code.

## Key Technologies:

*   **TypeScript:** The primary programming language.
*   **Node.js:** The runtime environment.
*   **@juspay/neurolink:** The AI provider library.
*   **Express:** Used to build the Confluence MCP server (in a previous iteration).
*   **Axios:** Used to make HTTP requests to the Confluence API.
*   **Cheerio:** Used to parse XML and HTML.
*   **dotenv:** Used to manage environment variables.
