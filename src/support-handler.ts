import { NeuroLink } from '@juspay/neurolink';
import { classifyQuery } from './query-classifier';
import { selectModel } from './model-selector';
import { getToolResponse } from '../tools/tool-registry';

interface Query {
  text: string;
  userId: string;
  ticketType: string;
  channel: string;
}

export async function handleSupportQuery(query: Query) {
  // console.log(`Received query: "${query.text}"`);

  const neurolink = new NeuroLink();

  // 1. Intelligent Routing
  const complexity = await classifyQuery(query.text);
  const model = selectModel(complexity);
  // console.log(`Query complexity: ${complexity}, Selected model: ${model}`);

  // 2. Prepare context for the AI
  const context = {
    userId: query.userId,
    ticketType: query.ticketType,
    channel: query.channel,
  };

  // 3. Integrated Data Access via MCP (Simulated)
  const toolResponse = await getToolResponse(query.text);
  const fullPrompt = `${toolResponse}\n\nCustomer query: ${query.text}\n\nPlease provide a helpful and empathetic response. Format the response using markdown for readability.`;

  // 4. Generate Response
  const stream = await neurolink.stream({
    input: {
      text: fullPrompt,
    },
    model: model,
    provider: 'google-ai',
    context: context,
  });

  let content = "";
  for await (const chunk of stream.stream) {
    content += chunk.content || "";
  }

  // console.log('--- AI Response ---');
  console.log(content);
  // console.log('-------------------');

  return { content };
}
