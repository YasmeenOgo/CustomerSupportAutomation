# Customer Support Automation with NeuroLink and Confluence

This project is an AI-first customer support system that integrates with your internal Confluence documentation to provide intelligent, automated responses to user queries.

## The Challenge

Companies face a high volume of repetitive support queries across various channels, leading to overloaded agents and slow response times. This project aims to solve that problem by providing a smart, automated solution.

## The Solution

We've built an AI-powered support system that connects directly to your Confluence instance. It uses natural language processing to understand user queries, search for relevant documentation, and provide accurate, context-aware answers.

## Key Features

*   **Intelligent Query Routing:** Automatically classifies queries to determine the best AI model for the job, balancing speed, cost, and accuracy.
*   **Live Confluence Integration:** Uses a custom MCP (Model Context Protocol) server to perform real-time searches of your Confluence documentation.
*   **Dynamic Content Retrieval:** Not only finds relevant articles but also fetches their full content to provide comprehensive answers.
*   **Formatted for Readability:** Responses are formatted using markdown to ensure they are clear, concise, and easy to understand.

## Demonstration

<video src="customerSupport.mov" width="100%"></video>

## How It Works

1.  **User Query:** The application prompts the user for a support query in the terminal.
2.  **Query Classification:** The query is classified as "simple" or "complex" to determine the most appropriate AI model.
3.  **MCP Server:** The application sends the query to the Confluence MCP server.
4.  **Confluence Search:** The MCP server performs a live search of your Confluence instance using the provided API credentials.
5.  **Content Retrieval:** If a relevant document is found, the MCP server fetches the full content of that page.
6.  **Response Generation:** The retrieved content is combined with the user's original query and sent to the AI provider to generate a helpful, context-aware response.
7.  **Formatted Output:** The AI's response is formatted using markdown and displayed to the user in the terminal.

## How to Use

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YasmeenOgo/CustomerSupportAutomation.git
    cd CustomerSupportAutomation
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment:**
    *   Create a `.env` file in the root of the project.
    *   Add your Confluence credentials to the `.env` file:
        ```
        CONFLUENCE_BASE_URL=https://your-domain.atlassian.net/wiki
        ATLASSIAN_USERNAME=your-email@example.com
        ATLASSIAN_API_TOKEN=your-api-token
        ```
    *   Add your Google AI API key to the `.env` file:
        ```
        GOOGLE_AI_API_KEY=your-google-ai-api-key
        ```
4.  **Run the application:**
    ```bash
    npm start
    ```
5.  **Interact with the agent:**
    *   The terminal will prompt you with `>`.
    *   Type your support query and press Enter.
    *   Type `quit` to exit the application.

## The Impact

*   **Autonomous Ticket Resolution:** A significant portion of support tickets can be resolved without human intervention.
*   **Reduced Response Times:** Users receive instant answers to their questions, improving customer satisfaction.
*   **Lower Agent Workload:** Support agents can focus on complex, high-value interactions, improving efficiency and job satisfaction.
