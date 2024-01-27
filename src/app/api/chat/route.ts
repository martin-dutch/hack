
import {AIbitat} from 'aibitat'
import openai from 'openai';

export async function POST(request: Request) {
  const { message } = await request.json();

  // // Initialize OpenAI API
  // openai.apiKey = process.env.OPENAI_KEY;

  // // Create the prompt
  // const prompt = `Human: ${message}\nAI:`;

  // // Make the OpenAI API call
  // const response = await openai.Completions.create({
  //   model: "gpt-3.5-turbo", // or any other model you prefer
  //   messages: [{ role: "user", content: message }],
  // });

  // // Extract and return the response
  // const aiResponse = response.data.choices[0].message.content;

  

  const aibitat = new AIbitat()
  
    .agent('client', {
      interrupt: 'ALWAYS',
      role: 'You are a human assistant. Reply "TERMINATE" when there is a correct answer or there`s no answer to the question.',
    })
    .agent('mathematician', {
      role: `You are a Mathematician and only solve math problems from @client`,
    })
    .agent('reviewer', {
      role: `You are a Peer-Reviewer and you do not solve math problems. 
      Check the result from @mathematician and then confirm. Just confirm, no talk.`,
    })
    .channel('management', ['mathematician', 'reviewer', 'client'])

  // aibitat.onMessage(console.log)

  await aibitat.start({
    from: 'client',
    to: 'management',
    content: 'How much is 2 + 2?',
  })

  console.log(aibitat.chats)
  
  return new Response(JSON.stringify(aibitat.chats), {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
