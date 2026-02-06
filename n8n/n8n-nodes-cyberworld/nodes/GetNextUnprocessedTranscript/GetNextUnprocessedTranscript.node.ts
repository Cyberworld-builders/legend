import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

interface NextUnprocessedResponse {
  transcript?: Record<string, unknown> | null;
  error?: string;
}

export class GetNextUnprocessedTranscript implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Get Next Unprocessed Transcript',
    name: 'getNextUnprocessedTranscript',
    group: ['transform'],
    version: 1,
    subtitle: 'Poll for one unprocessed transcript',
    description: 'Fetches the next transcript where is_processed is false (FIFO by created_at). Outputs one item for the Transcript Cleanup Agent, or none if no unprocessed transcript.',
    defaults: {
      name: 'Get Next Unprocessed Transcript',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'cyberWorldApi',
        required: true,
      },
    ],
    properties: [],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('cyberWorldApi');
    const baseUrl = (credentials?.baseUrl as string)?.replace(/\/$/, '') || 'http://localhost:3000';
    const apiKey = credentials?.apiKey as string | undefined;

    const url = `${baseUrl}/api/automation/transcripts/next-unprocessed`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    let response: { statusCode: number; body: NextUnprocessedResponse };
    try {
      response = await this.helpers.httpRequest({
        method: 'GET',
        url,
        headers,
        timeout: 15000,
        returnFullResponse: true,
      }) as { statusCode: number; body: NextUnprocessedResponse };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message.includes('401') || message.includes('Unauthorized')) {
        throw new Error('Invalid or missing API key. Set CYBERWORLD_AUTOMATION_API_KEY in the app and use the same value in the CyberWorld API credential.');
      }
      throw new Error(`Failed to fetch next unprocessed transcript: ${message}`);
    }

    const statusCode = response.statusCode;
    const body = typeof response.body === 'string' ? JSON.parse(response.body) as NextUnprocessedResponse : response.body;

    if (statusCode === 401) {
      throw new Error('Invalid or missing API key. Set CYBERWORLD_AUTOMATION_API_KEY in the app and use the same value in the CyberWorld API credential.');
    }

    if (statusCode >= 500) {
      throw new Error(body?.error || `Server error (${statusCode})`);
    }

    const transcript = body?.transcript ?? null;
    const returnData: INodeExecutionData[] = [];

    if (transcript && typeof transcript === 'object') {
      returnData.push({ json: transcript as IDataObject });
    }

    return [returnData];
  }
}
