/**
 * Pillar configuration for hub pages.
 * 
 * Maps posts to pillars via two mechanisms:
 * 1. Tags: posts with matching tags are included
 * 2. Explicit slugs: specific posts can be explicitly included
 */

export interface PillarConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  explicitSlugs: string[];
}

export const pillars: PillarConfig[] = [
  {
    id: 'agents',
    slug: 'agents',
    title: 'Agents as instruments',
    description: 'The memory, tools, and operating systems around AI that let people and agents do difficult work together.',
    tags: [
      'ai-agents',
      'ai-agent-automation',
      'claude-code',
      'coding-agents',
      'openclaw',
      'gusclaw',
      'multi-agent-orchestration',
      'ai-tools',
      'agentic-ai',
      'agent-harness',
      'custom-harness',
      'agent-orchestration',
      'ai-assistant',
      'ai-coding-workflow',
      'self-healing-agents',
      'self-healing-automation',
      'autonomous-systems',
      'subagents',
      'observatory',
      'herdr',
      'context-engineering',
      'executive-productivity-tunnel',
      'omarchy',
      'workflow-orchestration',
      'human-in-the-loop',
      'ai-operating-system',
      'agentic-automation',
      'agentic-tooling',
    ],
    explicitSlugs: [
      'stop-wrapping-the-frontier-harness',
      'why-my-ai-os-survived-anthropics-harness-lockdown',
      'gusclaw-observatory-watching-ai-team-work',
      'agent-specialists-changed-how-i-build-software',
      'self-healing-agents-prompt-monkey-era',
      'first-real-outage-autonomous-systems',
      'n8n-inside-ai-agent-team',
      'three-terminals-zero-myth',
      'building-a-generative-framework-evolving-ai-coding-agents-and-human-ai-collaboration',
      'keep-one-foot-on-the-ground',
      'show-up-with-the-solution-already-built',
      'code-first-n8n-custom-nodes-automation-workflow',
      'the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization',
    ],
  },
  {
    id: 'media',
    slug: 'media',
    title: 'Media that listens back',
    description: 'Music and film as material to explore, annotate, learn from, and reshape with human judgment in the loop.',
    tags: [
      'AI-music',
      'music-AI',
      'ai-music',
      'drum-transcription',
      'drum-notation',
      'music-notation',
      'music-production',
      'music-technology',
      'music-tech',
      'rznjn',
      'music-as-code',
      'audio-analysis',
      'audio-engineering',
      'creative-tools',
      'video-editing-automation',
      'ai-content-pipeline',
      'content-pipeline',
      'video-publishing',
      'ffmpeg',
      'cyberworld-media-studios',
      'human-AI-collaboration',
      'AI-creativity',
      'session-musician',
    ],
    explicitSlugs: [
      'rznjn-human-ai-music-collaboration',
      'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom',
      'from-hybrid-intel-trio-to-drum-note-evolving-ai-human-synergy-in-music-collaboration',
      'command-line-video-editing-claude-ffmpeg',
      'content-publishing-engine-voice-memos-to-video',
    ],
  },
  {
    id: 'atmosphere',
    slug: 'atmosphere',
    title: 'Technology with atmosphere',
    description: 'Interactive horror, mixed reality, puzzles, and physical systems where the technology serves the feeling.',
    tags: [
      'revenant-hollow',
      'mixed-reality',
      'augmented-reality',
      'ar-maintenance',
      'ar',
      'location-based',
      'location-based-entertainment',
      'horror',
      'horror-tech',
      'haunted-attractions',
      'IoT',
      'spatial-computing',
      'theatrical',
      'niantic',
      '8th-wall',
      'practical-effects',
      'cemetery-app',
      'gps-mapping',
      'autonomous-drones',
      'death-care-ar',
      'entertainment-tech',
    ],
    explicitSlugs: [
      'occult-artifact-ar-wrapper-puzzle-fun',
      'revenant-hollow-never-stopped-being-alive',
      'revenant-hollow-integrating-technology-into-location-based-horror-experiences',
      'cemetery-management-application-gps-mapping-ar-integration-and-autonomous-maintenance-for-funeral-homes',
      'first-pitch-meeting-reflections-lessons-confidence-and-alignment-in-death-care-and-ar-innovation',
    ],
  },
];

export function getPillarBySlug(slug: string): PillarConfig | undefined {
  return pillars.find((p) => p.slug === slug);
}

export function getPillarIds(): string[] {
  return pillars.map((p) => p.slug);
}
