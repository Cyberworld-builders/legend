import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';

const memory = new BufferMemory();
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

const systemPrompt = SystemMessagePromptTemplate.fromTemplate(
  'You are a helpful assistant for CyberWorld, a futuristic tech platform. CyberWorld is a digital ecosystem for builders, creators, and innovators, offering tools for authentication, payments, and more. Respond in a friendly and professional tone.'
);
const humanPrompt = HumanMessagePromptTemplate.fromTemplate('{input}');
const prompt = ChatPromptTemplate.fromMessages([systemPrompt, humanPrompt]);

const chain = new ConversationChain({
  llm,
  memory,
  prompt,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await chain.invoke({ input: message });
    return NextResponse.json({ response: response.response });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}