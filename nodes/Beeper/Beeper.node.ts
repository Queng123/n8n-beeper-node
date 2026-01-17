import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Beeper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Beeper',
		name: 'beeper',
		icon: { light: 'file:beeper.svg', dark: 'file:beeper.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Beeper Desktop API to manage chats and messages',
		defaults: {
			name: 'Beeper',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'beeperApi',
				required: true,
			},
		],
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Message',
						value: 'message',
					},
				],
				default: 'message',
			},

			// ==================== ACCOUNT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List all connected accounts',
						action: 'List all accounts',
					},
				],
				default: 'list',
			},

			// ==================== CHAT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['chat'],
					},
				},
				options: [
					{
						name: 'Archive',
						value: 'archive',
						description: 'Archive or unarchive a chat',
						action: 'Archive a chat',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new chat',
						action: 'Create a chat',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get details of a specific chat',
						action: 'Get a chat',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all chats',
						action: 'List all chats',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for chats',
						action: 'Search chats',
					},
				],
				default: 'list',
			},

			// ==================== CONTACT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search for contacts',
						action: 'Search contacts',
					},
				],
				default: 'search',
			},

			// ==================== MESSAGE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List messages in a chat',
						action: 'List messages',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for messages',
						action: 'Search messages',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message to a chat',
						action: 'Send a message',
					},
				],
				default: 'send',
			},

			// ==================== CHAT PARAMETERS ====================
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['get', 'archive'],
					},
				},
				description: 'The ID of the chat',
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['create'],
					},
				},
				description: 'The ID of the account to create the chat in',
			},
			{
				displayName: 'Recipient',
				name: 'recipient',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['create'],
					},
				},
				description: 'The recipient identifier (phone number, username, etc.)',
			},
			{
				displayName: 'Archive',
				name: 'archive',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['archive'],
					},
				},
				description: 'Whether to archive (true) or unarchive (false) the chat',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['search'],
					},
				},
				description: 'The search query for finding chats',
			},

			// ==================== MESSAGE PARAMETERS ====================
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send', 'list'],
					},
				},
				description: 'The ID of the chat',
			},
			{
				displayName: 'Message Text',
				name: 'messageText',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				description: 'The text of the message to send',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['search'],
					},
				},
				description: 'The search query for finding messages',
			},

			// ==================== CONTACT PARAMETERS ====================
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['search'],
					},
				},
				description: 'The ID of the account to search contacts in',
			},
			{
				displayName: 'Search Query',
				name: 'contactQuery',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['search'],
					},
				},
				description: 'The search query for finding contacts',
			},

			// ==================== ADDITIONAL OPTIONS ====================
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['chat', 'message'],
						operation: ['list'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 50,
						description: 'Max number of results to return',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('beeperApi');
		const baseUrl = credentials.baseUrl as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let method: IHttpRequestMethods = 'GET';
				let endpoint = '';
				let body: IDataObject = {};
				const qs: IDataObject = {};

				// ==================== ACCOUNT ====================
				if (resource === 'account') {
					if (operation === 'list') {
						endpoint = '/v1/accounts';
					}
				}

				// ==================== CHAT ====================
				if (resource === 'chat') {
					if (operation === 'list') {
						endpoint = '/v1/chats';
					}

					if (operation === 'get') {
						const chatId = this.getNodeParameter('chatId', i) as string;
						endpoint = `/v1/chats/${encodeURIComponent(chatId)}`;
					}

					if (operation === 'create') {
						method = 'POST';
						endpoint = '/v1/chats';
						const accountId = this.getNodeParameter('accountId', i) as string;
						const recipient = this.getNodeParameter('recipient', i) as string;
						body = {
							account_id: accountId,
							recipient,
						};
					}

					if (operation === 'search') {
						endpoint = '/v1/chats/search';
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;
						qs.q = searchQuery;
					}

					if (operation === 'archive') {
						method = 'POST';
						const chatId = this.getNodeParameter('chatId', i) as string;
						const archive = this.getNodeParameter('archive', i) as boolean;
						endpoint = `/v1/chats/${encodeURIComponent(chatId)}/archive`;
						body = {
							archive,
						};
					}
				}

				// ==================== MESSAGE ====================
				if (resource === 'message') {
					if (operation === 'send') {
						method = 'POST';
						const chatId = this.getNodeParameter('chatId', i) as string;
						const messageText = this.getNodeParameter('messageText', i) as string;
						endpoint = `/v1/chats/${encodeURIComponent(chatId)}/messages`;
						body = {
							text: messageText,
						};
					}

					if (operation === 'list') {
						const chatId = this.getNodeParameter('chatId', i) as string;
						endpoint = `/v1/chats/${encodeURIComponent(chatId)}/messages`;
					}

					if (operation === 'search') {
						endpoint = '/v1/messages/search';
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;
						qs.q = searchQuery;
					}
				}

				// ==================== CONTACT ====================
				if (resource === 'contact') {
					if (operation === 'search') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const contactQuery = this.getNodeParameter('contactQuery', i) as string;
						endpoint = `/v1/accounts/${encodeURIComponent(accountId)}/contacts`;
						qs.q = contactQuery;
					}
				}

				// Make the API request
				const requestOptions: IHttpRequestOptions = {
					method,
					url: `${baseUrl}${endpoint}`,
					qs,
					body: Object.keys(body).length > 0 ? body : undefined,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'beeperApi',
					requestOptions,
				);

				let responseData = response as IDataObject;

				if ((resource === 'chat' || resource === 'message') && operation === 'list') {
					const options = this.getNodeParameter('options', i, {}) as IDataObject;
					const limit = options.limit as number | undefined;

					if (responseData.items && Array.isArray(responseData.items)) {
						let items = responseData.items as IDataObject[];
						if (limit && items.length > limit) {
							items = items.slice(0, limit);
						}
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(items),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
						continue;
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
