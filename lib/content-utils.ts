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
    slug: 'revenant-hollow-integrating-technology-into-location-based-horror-experiences',
    title: 'Revenant Hollow: Integrating Technology into Location-Based Horror Experiences',
    keywords: ['mixed reality', 'virtual reality', 'augmented reality', 'IoT', 'location-based entertainment', 'haunted houses', 'Halloween attractions', 'automation', 'robotics', 'theatrical attractions', 'interactive experiences', 'mobile integration', 'geolocation', 'scare props', 'augmented reality sports complex']
  },
  {
    slug: 'my-first-steps-into-coding',
    title: 'My First Steps into Coding: A Biographical Journey',
    keywords: ['coding journey', 'HTML', 'CSS', 'Flash', 'web development', 'career transition', 'self-directed learning', 'programming', 'software development', 'biographical', 'early career', 'technology']
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
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = enhancedContent.match(regex);
      
      if (matches && matches.length > 0) {
        // Only link the first occurrence of this keyword
        enhancedContent = enhancedContent.replace(
          regex,
          `[${keyword}](/blog/${post.slug})`
        );
        linkedPosts.add(post.slug);
        break; // Move to next post
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
      'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom'
    ],
    'Career & Professional Development': [
      'building-an-effective-web-presence-for-professional-validation',
      'my-first-tech-job-the-evolution-of-the-docworks-emr-system-2011-2013',
      'the-jumpstarter-a-5-point-framework-to-align-value-and-passion',
      'the-last-cycle-why-founder-engineer-partnerships-are-nearing-their-end'
    ],
    'Development & Tools': [
      'replit-test-drive',
      'troubleshooting-n8n-workflows-integrated-with-supabase-vapi-and-lovable-for-ai-driven-sales-automation'
    ],
    'Marketing & Business': [
      'building-an-effective-web-presence-for-professional-validation',
      'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom',
      'the-last-cycle-why-founder-engineer-partnerships-are-nearing-their-end'
    ]
  };
}
