// Utility functions for content enhancement and internal linking

export interface PostReference {
  slug: string;
  title: string;
  keywords: string[];
}

// Define post references with keywords for automatic linking
export const postReferences: PostReference[] = [
  {
    slug: 'building-an-effective-web-presence-for-professional-validation',
    title: 'Building an Effective Web Presence for Professional Validation',
    keywords: ['web presence', 'professional validation', 'SEO', 'marketing', 'blogging', 'digital presence']
  },
  {
    slug: 'scaling-novelty-with-an-agentic-blog-bot',
    title: 'Scaling Novelty with an Agentic Blog Bot',
    keywords: ['AI', 'blog bot', 'automation', 'chatbot', 'AI integration', 'agentic']
  },
  {
    slug: 'troubleshooting-n8n-workflows-integrated-with-supabase-vapi-and-lovable-for-ai-driven-sales-automation',
    title: 'Troubleshooting n8n Workflows',
    keywords: ['n8n', 'workflows', 'Supabase', 'Vapi', 'automation', 'troubleshooting', 'AI voice', 'sales automation']
  },
  {
    slug: 'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom',
    title: 'Building Drum Note AI',
    keywords: ['AI', 'music', 'transcription', 'drum', 'marketing', 'Render', 'automation']
  },
  {
    slug: 'my-first-tech-job-the-evolution-of-the-docworks-emr-system-2011-2013',
    title: 'My First Tech Job: DocWorks EMR System',
    keywords: ['healthcare', 'EMR', 'electronic medical records', 'first job', 'career', 'technology']
  },
  {
    slug: 'the-jumpstarter-a-5-point-framework-to-align-value-and-passion',
    title: 'The Jumpstarter Framework',
    keywords: ['productivity', 'framework', 'value', 'passion', 'alignment', 'career development']
  },
  {
    slug: 'the-last-cycle-why-founder-engineer-partnerships-are-nearing-their-end',
    title: 'The Last Cycle: Founder-Engineer Partnerships',
    keywords: ['partnerships', 'founder', 'engineer', 'business', 'industry trends', 'career']
  },
  {
    slug: 'replit-test-drive',
    title: 'Replit Test Drive',
    keywords: ['Replit', 'development', 'tools', 'testing', 'programming', 'IDE']
  },
  {
    slug: 'building-a-generative-framework-evolving-ai-coding-agents-and-human-ai-collaboration',
    title: 'Building a Generative Framework: Evolving AI Coding Agents',
    keywords: ['generative framework', 'coding agents', 'AI autonomy', 'human-AI collaboration', 'software development', 'LLM productivity', 'prompt engineering', 'agentic AI']
  },
  {
    slug: 'the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization',
    title: 'The Power of Flat Files in Blogging',
    keywords: ['flat files', 'blogging', 'Jamstack', 'Next.js', 'AI content creation', 'coding agents', 'generative search', 'YAML frontmatter', 'Markdown', 'IDE indexing']
  },
  {
    slug: 'revenant-hollow-integrating-technology-into-location-based-horror-experiences',
    title: 'Revenant Hollow: Integrating Technology into Location-Based Horror Experiences',
    keywords: ['mixed reality', 'virtual reality', 'augmented reality', 'IoT', 'location-based entertainment', 'haunted houses', 'Halloween attractions', 'automation', 'robotics', 'theatrical attractions', 'interactive experiences', 'mobile integration', 'geolocation', 'scare props', 'augmented reality sports complex']
  },
  {
    slug: 'my-first-steps-into-coding',
    title: 'My First Steps into Coding: A Biographical Journey',
    keywords: ['coding journey', 'HTML', 'CSS', 'Flash', 'web development', 'career transition', 'self-directed learning', 'programming', 'software development', 'biographical', 'early career', 'technology']
  },
  {
    slug: 'building-a-generative-framework-evolving-ai-coding-agents-and-human-ai-collaboration',
    title: 'Building a Generative Framework: Evolving AI Coding Agents',
    keywords: ['generative framework', 'coding agents', 'AI autonomy', 'human-AI collaboration', 'software development', 'LLM productivity', 'prompt engineering', 'agentic AI', 'AI training data', 'heuristic for AI use']
  },
  {
    slug: 'the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization',
    title: 'The Power of Flat Files in Blogging',
    keywords: ['flat files', 'blogging', 'Jamstack', 'Next.js', 'AI content creation', 'coding agents', 'generative search', 'YAML frontmatter', 'Markdown', 'IDE indexing', 'SEO schema updates', 'human-AI collaboration']
  },
  {
    slug: 'revisiting-old-code-lessons-in-growth-enterprise-vs-startup-mindsets-and-ai-driven-infrastructure-evolution',
    title: 'Revisiting Old Code: Lessons in Growth',
    keywords: ['code quality', 'infrastructure as code', 'generative AI', 'enterprise vs startup', 'DevOps practices', 'cloud architecture', 'security practices', 'startup agility', 'terraform', 'AI-assisted development']
  }
];

// Function to add internal links to content
export function addInternalLinks(content: string, currentSlug: string): string {
  let enhancedContent = content;
  
  // Sort posts by keyword count (most specific first) to avoid over-linking
  const sortedPosts = postReferences
    .filter(post => post.slug !== currentSlug)
    .sort((a, b) => b.keywords.length - a.keywords.length);
  
  // Track which posts have been linked to avoid duplicate links
  const linkedPosts = new Set<string>();
  
  for (const post of sortedPosts) {
    if (linkedPosts.has(post.slug)) continue;
    
    // Find the best keyword match
    for (const keyword of post.keywords) {
      // Escape special regex characters in the keyword
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Simple word boundary regex - we'll filter out matches inside links manually
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
      const matches = enhancedContent.match(regex);
      
      if (matches && matches.length > 0) {
        // Check if the match is inside an existing markdown link
        let matchIndex = 0;
        let foundValidMatch = false;
        
        for (let i = 0; i < matches.length; i++) {
          const match = matches[i];
          const currentIndex = enhancedContent.indexOf(match, matchIndex);
          
          // Check if this match is inside a markdown link [text](url)
          const beforeMatch = enhancedContent.substring(0, currentIndex);
          
          // Count unclosed brackets before the match
          const openBrackets = (beforeMatch.match(/\[/g) || []).length;
          const closeBrackets = (beforeMatch.match(/\]/g) || []).length;
          const openParens = (beforeMatch.match(/\(/g) || []).length;
          const closeParens = (beforeMatch.match(/\)/g) || []).length;
          
          // If we're inside a markdown link, skip this match
          if (openBrackets > closeBrackets && openParens > closeParens) {
            matchIndex = currentIndex + match.length;
            continue;
          }
          
          // This is a valid match, replace it
          enhancedContent = enhancedContent.substring(0, currentIndex) + 
                           `[${keyword}](/blog/${post.slug})` + 
                           enhancedContent.substring(currentIndex + match.length);
          foundValidMatch = true;
          break;
        }
        
        if (foundValidMatch) {
          linkedPosts.add(post.slug);
          break; // Move to next post
        }
      }
    }
  }
  
  return enhancedContent;
}

// Function to get topic clusters for related content
export function getTopicClusters(): { [topic: string]: string[] } {
  return {
    'AI & Automation': [
      'scaling-novelty-with-an-agentic-blog-bot',
      'troubleshooting-n8n-workflows-integrated-with-supabase-vapi-and-lovable-for-ai-driven-sales-automation',
      'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom',
      'building-a-generative-framework-evolving-ai-coding-agents-and-human-ai-collaboration',
      'the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization',
      'revenant-hollow-integrating-technology-into-location-based-horror-experiences',
      'enhancing-seo-on-my-company-landing-site-with-ai-agents'
    ],
    'Career & Professional Development': [
      'building-an-effective-web-presence-for-professional-validation',
      'my-first-tech-job-the-evolution-of-the-docworks-emr-system-2011-2013',
      'the-jumpstarter-a-5-point-framework-to-align-value-and-passion',
      'the-last-cycle-why-founder-engineer-partnerships-are-nearing-their-end',
      'my-first-steps-into-coding',
      'intro-to-linux-how-i-stayed-in-the-dev-game-while-too-broke-to-buy-a-pc',
      'early-adventures-in-freelance-web-development-lessons-from-the-wordpress-era',
      'transitioning-from-cable-contracting-to-freelance-web-development-a-career-pivot',
      'revisiting-old-code-lessons-in-growth-enterprise-vs-startup-mindsets-and-ai-driven-infrastructure-evolution'
    ],
    'Development & Tools': [
      'replit-test-drive',
      'troubleshooting-n8n-workflows-integrated-with-supabase-vapi-and-lovable-for-ai-driven-sales-automation',
      'my-first-tech-job-the-evolution-of-the-docworks-emr-system-2011-2013',
      'intro-to-linux-how-i-stayed-in-the-dev-game-while-too-broke-to-buy-a-pc',
      'early-adventures-in-freelance-web-development-lessons-from-the-wordpress-era',
      'building-a-generative-framework-evolving-ai-coding-agents-and-human-ai-collaboration',
      'the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization',
      'enhancing-seo-on-my-company-landing-site-with-ai-agents',
      'revisiting-old-code-lessons-in-growth-enterprise-vs-startup-mindsets-and-ai-driven-infrastructure-evolution'
    ],
    'Marketing & Business': [
      'building-an-effective-web-presence-for-professional-validation',
      'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom',
      'the-last-cycle-why-founder-engineer-partnerships-are-nearing-their-end',
      'enhancing-seo-on-my-company-landing-site-with-ai-agents',
      'scaling-novelty-with-an-agentic-blog-bot'
    ]
  };
}
