import * as Vapi from "../index";

export interface Assistant {
  /** These are the options for the assistant's transcriber. */
  transcriber?: Vapi.AssistantTranscriber;
  /** These are the options for the assistant's LLM. */
  model?: Vapi.AssistantModel;
  /** These are the options for the assistant's voice. */
  voice?: Vapi.AssistantVoice;
  /** This is the mode for the first message. */
  firstMessageMode?: Vapi.AssistantFirstMessageMode;
  /** When this is enabled, no logs, recordings, or transcriptions will be stored. */
  hipaaEnabled?: boolean;
  /** These are the messages that will be sent to your Client SDKs. */
  clientMessages?: Vapi.AssistantClientMessagesItem[];
  /** These are the messages that will be sent to your Server URL. */
  serverMessages?: Vapi.AssistantServerMessagesItem[];
  /** This is the unique identifier for the assistant. */
  id: string;
  /** This is the unique identifier for the org that this assistant belongs to. */
  orgId: string;
  /** This is the ISO 8601 date-time string of when the assistant was created. */
  createdAt: string;
  /** This is the ISO 8601 date-time string of when the assistant was last updated. */
  updatedAt: string;
  /** This is the name of the assistant. */
  name?: string;
}