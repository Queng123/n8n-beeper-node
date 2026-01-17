import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BeeperApi implements ICredentialType {
	name = 'beeperApi';
	displayName = 'Beeper API';
	documentationUrl = 'https://developers.beeper.com/desktop-api';
	icon = { light: 'file:beeper.svg', dark: 'file:beeper.dark.svg' } as const;
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:23373',
			placeholder: 'http://localhost:23373',
			description: 'The base URL of your Beeper Desktop API',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The API token for authentication (if required)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/accounts',
			method: 'GET',
		},
	};
}
