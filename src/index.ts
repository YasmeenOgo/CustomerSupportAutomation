import * as readline from 'readline';
import { handleSupportQuery } from './support-handler';

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Customer Support Chatbot");
  console.log("Enter 'quit' to exit.");

  rl.on('line', async (input) => {
    if (input.toLowerCase() === 'quit') {
      rl.close();
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
