import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

const DEFAULT_SYSTEM_PROMPT = `You are an editor cleaning a voice memo transcript. Your job is to:
- Fix spelling and grammar using context (e.g. homophones, technical terms).
- Preserve the author's voice and tone; do not formalize or rewrite.
- Do not add or remove substantive content.
- Optionally normalize obvious formatting: repeated filler (um, uh), stray line breaks. Do not add headings or structure.
Output only the cleaned transcript. No preamble, no "Here is the cleaned version", no markdown.`;

export class TranscriptCleanupAgent implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Transcript Cleanup Agent',
    name: 'transcriptCleanupAgent',
    group: ['transform'],
    version: 1,
    subtitle: 'Clean transcript',
    description: 'Clean raw transcript text with OpenAI: fix spelling from context, preserve voice, optional light formatting',
    defaults: {
      name: 'Transcript Cleanup Agent',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'openAiApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: 'gpt-4o-mini',
        description: 'OpenAI model to use for cleanup',
      },
      {
        displayName: 'Temperature',
        name: 'temperature',
        type: 'number',
        typeOptions: { min: 0, max: 2, step: 0.1 },
        default: 0.3,
        description: 'Lower = more consistent, higher = more varied',
      },
      {
        displayName: 'Max Tokens',
        name: 'maxTokens',
        type: 'number',
        typeOptions: { min: 256, max: 128000, step: 256 },
        default: 4096,
        description: 'Maximum tokens in the response',
      },
      {
        displayName: 'Override System Prompt',
        name: 'systemPromptOverride',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        placeholder: 'Leave empty to use the default cleanup instructions',
        description: 'Optional: replace the default cleanup instructions with your own',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const model = this.getNodeParameter('model', 0) as string;
    const temperature = this.getNodeParameter('temperature', 0) as number;
    const maxTokens = this.getNodeParameter('maxTokens', 0) as number;
    const systemPromptOverride = this.getNodeParameter('systemPromptOverride', 0, '') as string;
    const systemPrompt = systemPromptOverride.trim() || DEFAULT_SYSTEM_PROMPT;

    const credentials = await this.getCredentials('openAiApi');
    const apiKey = credentials?.apiKey as string;
    if (!apiKey) {
      throw new Error('OpenAI API key is required. Configure the OpenAI API credential.');
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const json = item.json as Record<string, unknown>;
      const transcriptText = json.transcript_text ?? json.transcriptText ?? '';
      const rawText = typeof transcriptText === 'string' ? transcriptText : String(transcriptText);

      if (!rawText.trim()) {
        returnData.push({
          json: {
            ...json,
            cleaned_text: '',
            cleanup_error: 'No transcript_text provided',
          },
        });
        continue;
      }

      try {
        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: 'https://api.openai.com/v1/chat/completions',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: {
            model,
            temperature,
            max_tokens: maxTokens,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: rawText },
            ],
          },
          timeout: 60000,
        }) as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };

        if (response.error?.message) {
          returnData.push({
            json: {
              ...json,
              cleaned_text: '',
              cleanup_error: response.error.message,
            },
          });
          continue;
        }

        const content = response.choices?.[0]?.message?.content ?? '';
        returnData.push({
          json: {
            ...json,
            cleaned_text: content.trim(),
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        returnData.push({
          json: {
            ...json,
            cleaned_text: '',
            cleanup_error: message,
          },
        });
      }
    }

    return [returnData];
  }
}
