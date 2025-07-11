require('dotenv').config();
const { createBestAIProvider, NeuroLink } = require('@juspay/neurolink');

/**
 * Handles an incoming customer support query.
 * @param {object} query - The customer query object.
 * @param {string} query.text - The text of the customer's query.
 * @param {string} query.userId - The ID of the user.
 * @param {string} query.ticketType - The type of the ticket (e.g., 'billing', 'technical').
 * @param {string} query.channel - The channel the query came from (e.g., 'email', 'chat').
 */
async function handleSupportQuery(query) {
  console.log(`Received query: "${query.text}"`);

  const neurolink = new NeuroLink();

  // 1. Intelligent Routing
  const complexity = await classifyQuery(query.text);
  const model = selectModel(complexity);
  console.log(`Query complexity: ${complexity}, Selected model: ${model}`);

  // 2. Prepare context for the AI
  const context = {
    userId: query.userId,
    ticketType: query.ticketType,
    channel: query.channel,
  };

  // 3. Integrated Data Access via MCP (Simulated)
  const toolResponse = await getToolResponse(query.text);
  const fullPrompt = `${toolResponse}\n\nCustomer query: ${query.text}\n\nPlease provide a helpful and empathetic response.`;

  // 4. Generate Response
  const result = await neurolink.generate({
    prompt: fullPrompt,
    model: model,
    provider: 'google-ai',
    context: context,
    fallbackOptions: {
      providers: ['anthropic', 'openai'], // Fallback if the primary provider fails
    },
  });

  console.log('--- AI Response ---');
  console.log(result.content);
  console.log('-------------------');

  return result;
}

/**
 * Classifies the query as 'simple' or 'complex'.
 * @param {string} queryText - The text of the customer's query.
 * @returns {Promise<'simple' | 'complex'>}
 */
async function classifyQuery(queryText) {
  const complexKeywords = ['fail', 'crash', 'error', 'bug', 'technical', 'issue', 'locked'];
  const isComplex = complexKeywords.some(keyword => queryText.toLowerCase().includes(keyword));
  return isComplex ? 'complex' : 'simple';
}

/**
 * Selects the appropriate AI model based on query complexity.
 * @param {'simple' | 'complex'} complexity - The complexity of the query.
 * @returns {string} The model to use.
 */
function selectModel(complexity) {
  if (complexity === 'simple') {
    return 'gemini-1.5-flash'; // Or 'mistral-small'
  } else {
    return 'gemini-pro'; // Or 'gpt-4o', 'claude-3-opus'
  }
}

/**
 * Simulates fetching data from external tools based on the query.
 * @param {string} queryText - The text of the customer's query.
 * @returns {Promise<string>}
 */
async function getToolResponse(queryText) {
  if (queryText.toLowerCase().includes('refund') || queryText.toLowerCase().includes('order')) {
    // MOCK: CRM tool
    return 'CRM Tool: Fetched order details. Refund processed on July 9, 2025.';
  } else if (queryText.toLowerCase().includes('upload fails') || queryText.toLowerCase().includes('crash')) {
    // MOCK: GitHub tool
    return 'GitHub Tool: Found issue #123 related to "Upload fails on Firefox 115". Status: In Progress. ETA: 2 days.';
  } else if (queryText.toLowerCase().includes('export invoices')) {
    // MOCK: Filesystem tool
    return 'Filesystem Tool: Found documentation for "bulk export invoices". Steps: 1. Go to Settings. 2. Click Export. 3. Select Invoices.';
  } else if (queryText.toLowerCase().includes('warranty')) {
    // MOCK: Filesystem tool
    return 'Filesystem Tool: The warranty period for the X-1 drone is one year from the date of purchase.';
  }
  return '';
}



// --- Example Usage ---
async function main() {
  const fs = require('fs');
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Customer Support Chatbot");
  console.log("Enter 'quit' to exit.");

  readline.on('line', async (input) => {
    if (input.toLowerCase() === 'quit') {
      readline.close();
      return;
    }

    const query = {
      text: input,
      userId: 'user-chat',
      ticketType: 'chat',
      channel: 'live-chat'
    };

    await handleSupportQuery(query);
    console.log('\n> ');
  });

  console.log('> ');
}

main().catch(console.error);
