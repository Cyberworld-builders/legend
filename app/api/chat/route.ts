import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
// import { getAllPostsWithMetadata } from '@/lib/post-metadata'; // Not used in this version
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const memory = new BufferMemory();
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

// Function to get relevant blog content based on user query using markdown files
async function getRelevantBlogContent(userQuery: string) {
  try {
    const markdownDir = path.join(process.cwd(), 'app', 'blog', 'posts', 'markdown');
    const files = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));
    
    const queryLower = userQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    // Score posts based on relevance
    const scoredPosts = files.map(filename => {
      const filePath = path.join(markdownDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);
      
      let score = 0;
      
      // Check title relevance (highest weight)
      const title = (frontmatter.title || '').toLowerCase();
      queryWords.forEach(word => {
        if (title.includes(word)) score += 5;
      });
      
      // Check description relevance
      const description = (frontmatter.description || '').toLowerCase();
      queryWords.forEach(word => {
        if (description.includes(word)) score += 3;
      });
      
      // Check content relevance (NEW - this is the key advantage!)
      const contentLower = (content || '').toLowerCase();
      queryWords.forEach(word => {
        const wordCount = (contentLower.match(new RegExp(word, 'g')) || []).length;
        score += wordCount * 2; // Weight by frequency
      });
      
      // Check tags relevance
      const tags = (frontmatter.tags || []).join(' ').toLowerCase();
      queryWords.forEach(word => {
        if (tags.includes(word)) score += 2;
      });
      
      // Check keywords relevance
      const keywords = (frontmatter.keywords || []).join(' ').toLowerCase();
      queryWords.forEach(word => {
        if (keywords.includes(word)) score += 1;
      });
      
      return {
        title: frontmatter.title,
        slug: filename.replace('.md', ''),
        description: frontmatter.description,
        topics: frontmatter.topics || [],
        tags: frontmatter.tags || [],
        content: content.substring(0, 300), // First 300 chars for context
        score
      };
    });
    
    // Return top 3 most relevant posts
    return scoredPosts
      .filter(post => post.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching blog content:', error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get relevant blog content
    const relevantContent = await getRelevantBlogContent(message);
    
    // Build dynamic system prompt with blog context
    let systemPrompt = `You are Jay Long, founder of CyberWorld Builders, a software engineering and consulting company specializing in web development, AWS solutions, and SaaS development.

Your expertise includes:
- AI and automation tools (coding agents, AI-assisted development, workflow automation)
- Career transitions and professional development (from cable contracting to freelance web development)
- Development frameworks and tools (Next.js, Jamstack, Docker, n8n, Supabase, Vapi)
- Marketing and business strategy (SEO optimization, professional branding, content strategy)
- Music technology and AI collaboration (Drum Note app, AI-human synergy in creative work)
- Enterprise vs startup mindsets and infrastructure evolution

You write extensively about these topics on your blog, sharing personal experiences, technical insights, and career reflections. Your writing style is conversational, authentic, and often includes personal anecdotes from your journey from cable contracting to software engineering.

When answering questions:
- Draw from your real-world experience and technical expertise
- Provide practical, actionable advice based on your own career transitions
- Reference your blog content and insights when relevant
- Be conversational and authentic to your voice
- Share relevant personal experiences that illustrate your points
- Focus on practical solutions and real-world applications
- When referencing blog posts, provide clickable links in the format: /blog/post-slug
- Always include relevant links to your articles when they support your answer

You're particularly passionate about AI-human collaboration, the evolution of development tools, and helping others navigate career transitions in tech.`;

    // Add relevant blog content to context
    if (relevantContent.length > 0) {
      systemPrompt += `\n\nRelevant blog content that might help answer this question:\n`;
      relevantContent.forEach((post, index) => {
        systemPrompt += `${index + 1}. "${post.title}"\n`;
        systemPrompt += `   Description: ${post.description}\n`;
        systemPrompt += `   Topics: ${post.topics.join(', ') || 'N/A'}\n`;
        systemPrompt += `   Tags: ${post.tags.join(', ') || 'N/A'}\n`;
        systemPrompt += `   Content snippet: "${post.content}..."\n`;
        systemPrompt += `   Link: /blog/${post.slug}\n\n`;
      });
      systemPrompt += `You can reference these articles and their content when providing answers. When mentioning these articles, always include the clickable link in the format /blog/post-slug.`;
    }

    const systemPromptTemplate = SystemMessagePromptTemplate.fromTemplate(systemPrompt);
    const humanPrompt = HumanMessagePromptTemplate.fromTemplate('{input}');
    const prompt = ChatPromptTemplate.fromMessages([systemPromptTemplate, humanPrompt]);

    const chain = new ConversationChain({
      llm,
      memory,
      prompt,
    });

    const response = await chain.invoke({ input: message });
    return NextResponse.json({ response: response.response });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}