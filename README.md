# n8n-nodes-beeper

This is an n8n community node. It lets you use **Beeper** in your n8n workflows.

[Beeper](https://beeper.com) is a unified messaging app that brings all your chat networks (iMessage, WhatsApp, Telegram, Signal, Slack, Discord, and more) into a single inbox. This node connects to the Beeper Desktop API to automate your messaging workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Account
- **List** - List all connected accounts (WhatsApp, Telegram, iMessage, etc.)

### Chat
- **List** - List all chats with optional limit
- **Get** - Get details of a specific chat by ID
- **Create** - Create a new chat with a recipient
- **Search** - Search for chats by query
- **Archive** - Archive or unarchive a chat

### Message
- **Send** - Send a message to a chat
- **List** - List messages in a chat with optional limit
- **Search** - Search for messages across all chats

### Contact
- **Search** - Search for contacts in a specific account

## Credentials

Before using this node, you need:

1. **Beeper Desktop** version 4.1.169 or later installed
2. **Beeper Desktop API** enabled:
   - Open Beeper Desktop
   - Go to **Settings > Developers**
   - Toggle **Beeper Desktop API** to enable it

To configure credentials in n8n:

1. Go to **Settings > Credentials**
2. Click **Add Credential**
3. Search for **Beeper API**
4. Configure:
   - **Base URL**: `http://localhost:23373` (default)
   - **API Token**: Use the one configured in Beeper
5. Click **Test** to verify the connection

## Compatibility

- **n8n**: 1.0.0+
- **Node.js**: 18.x+
- **Beeper Desktop**: 4.1.169+

## Usage

### Sending a message

1. Use **Chat > List** or **Chat > Search** to find the chat ID
2. Use **Message > Send** with the chat ID and your message text

### Finding a Chat ID

Chat IDs in Beeper have the format `!roomid:beeper.local`. You can get them by:
- Using the **Chat > List** operation
- Using the **Chat > Search** operation with a query

### Rate Limiting

Sending too many messages may result in account suspension by the messaging networks. Add delays between messages and use this node for personal automation only.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Beeper Website](https://beeper.com)
* [Beeper Desktop API Documentation](https://developers.beeper.com/desktop-api)

## Version history

### 0.1.0

Initial release with:
- Account operations: List
- Chat operations: List, Get, Create, Search, Archive
- Message operations: Send, List, Search
- Contact operations: Search
