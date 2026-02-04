import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CyberWorldApi implements ICredentialType {
  name = 'cyberWorldApi';
  displayName = 'CyberWorld API';
  documentationUrl = 'https://cyberworldbuilders.com';

  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'http://localhost:3000',
      description: 'The base URL of the CyberWorld Builders website',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Optional API key for authenticated endpoints (not required for health check)',
    },
  ];
}
