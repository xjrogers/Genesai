From the available documentation, I can share some partial type definitions:
File Response Type:
typescript
{
  id: string,
  orgId: string, 
  createdAt: string,
  updatedAt: string,
  object: "file",
  status: "indexed" | "not_indexed",
  name: string,
  originalName: string,
  bytes: number,
  purpose: string,
  mimetype: string,
  key: string,
  path: string,
  bucket: string,
  url: string,
  metadata: Record<string, any>
}
1
Assistant Response Type:
typescript
{
  id: string,
  orgId: string,
  createdAt: string, 
  updatedAt: string,
  transcriber: {
    // Transcriber options
  },
  model: {
    // Model options  
  },
  voice: {
    // Voice options
  },
  firstMessage: string,
  firstMessageMode: "assistant-speaks-first" | "assistant-speaks-first-with-model-generated-message" | "assistant-waits-for-user",
  hipaaEnabled: boolean,
  clientMessages: string[],
  serverMessages: string[],
  silenceTimeoutSeconds: number,
  maxDurationSeconds: number,
  backgroundSound: "off" | "office",
  backgroundDenoisingEnabled: boolean,
  modelOutputInMessagesEnabled: boolean,
  name: string,
  metadata: Record<string, any>
}

here are the required headers for API authentication:
Required Headers:
• Authorization: Bearer
• Content-Type: application/json
Authentication Methods:
• JWT Authentication:
javascript
const response = await fetch('https://api.vapi.ai/assistant', {
method: 'GET',
headers: {
'Content-Type': 'application/json',
Authorization: Bearer ${token},
},
});
Important Notes:
• Bearer authentication requires your auth token
• Make sure you're using the correct key type (public vs private) for your use case
• All assistant overrides will be passed as payload

here's how to initialize Vapi with a public API key in TypeScript:

typescript
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY ?? "");

const start = () => {
vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "")
}

useEffect(() => {
start()
vapi.on('speech-start', () => {
console.log('Speech has started');
});


vapi.on('speech-end', () => {
    console.log('Speech has ended');
});

vapi.on('call-start', () => {
    console.log('Call has started');
});

vapi.on('call-end', () => {
    console.log('Call has stopped');
});

vapi.on('volume-level', (volume) => {
    console.log(`Assistant volume level: ${volume}`);
});

vapi.on('error', (e) => {
    console.error('ASSISTANT ERROR',e)
});

return () => {
    vapi.stop()
}
}, [])
Important Notes:
• This example uses environment variables for the API key and assistant ID
• The public key is separate from your private API key - This code shows basic event handling for speech and call states


For secure API authentication with a private key, here's the recommended approach:
Prerequisites:
• Environment with JWT generation capability
• Account with service requiring JWT authentication
• Organization ID and private key from Vapi portal
JWT Token Generation:```javascript // Define the payload const payload = { orgId: process.env.ORG_ID, };
// Get the private key from environment variables const key = process.env.PRIVATE_KEY;
// Define token options const options = { expiresIn: '1h', };
// Generate the token using a JWT library or built-in functionality const token = generateJWT(payload, key, options);

Making Authenticated Requests:```javascript
async function getAssistants() {
const response = await fetch('https://api.vapi.ai/assistant', {
method: 'GET',
headers: {
'Content-Type': 'application/json',
Authorization: Bearer ${token},
},
});

const data = await response.json();
console.log(data);
}

fetchData().catch(console.error);
Important Security Notes:
• Never expose your private API key in frontend code
• Use environment variables for sensitive credentials1
• Token expires after the specified time (e.g., 1 hour in the example) For OAuth2 authentication, as of December 6, 2024, you can also use the authenticationSession dictionary which contains an accessToken and expiresAtdatetime to authenticate requests to your custom LLM or server URL