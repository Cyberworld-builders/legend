import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class CyberWorldTest implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'CyberWorld Test',
    name: 'cyberWorldTest',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Test node for CyberWorld Builders — echoes input or checks site health',
    defaults: {
      name: 'CyberWorld Test',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'cyberWorldApi',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Echo',
            value: 'echo',
            description: 'Echo the input text back with metadata',
          },
          {
            name: 'Health Check',
            value: 'healthCheck',
            description: 'Check the CyberWorld website health endpoint',
          },
        ],
        default: 'echo',
      },
      {
        displayName: 'Input Text',
        name: 'inputText',
        type: 'string',
        default: '',
        placeholder: 'Enter text to echo...',
        description: 'Text to echo back in the output',
        displayOptions: {
          show: {
            operation: ['echo'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      if (operation === 'echo') {
        const inputText = this.getNodeParameter('inputText', i, '') as string;
        returnData.push({
          json: {
            operation: 'echo',
            input: inputText,
            timestamp: new Date().toISOString(),
            node: 'CyberWorldTest',
            message: `Echo from CyberWorld: ${inputText}`,
          },
        });
      } else if (operation === 'healthCheck') {
        let baseUrl = 'http://localhost:3000';

        try {
          const credentials = await this.getCredentials('cyberWorldApi');
          if (credentials?.baseUrl) {
            baseUrl = credentials.baseUrl as string;
          }
        } catch {
          // Credentials not configured, use default
        }

        try {
          const response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/api/health`,
            timeout: 5000,
          });

          returnData.push({
            json: {
              operation: 'healthCheck',
              status: 'healthy',
              baseUrl,
              response,
              timestamp: new Date().toISOString(),
            },
          });
        } catch (error) {
          returnData.push({
            json: {
              operation: 'healthCheck',
              status: 'unreachable',
              baseUrl,
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    }

    return [returnData];
  }
}
