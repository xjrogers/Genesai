import type { 
  AssistantTranscriber, 
  AssistantModel, 
  AssistantVoice, 
  AssistantFirstMessageMode,
  AssistantClientMessagesItem,
  AssistantServerMessagesItem
} from '../Types';

import type { BaseEntity } from './common';

export interface Assistant extends BaseEntity {
  /** These are the options for the assistant's transcriber. */
  transcriber?: AssistantTranscriber;
  
  /** These are the options for the assistant's LLM. */
  model?: AssistantModel;
  
  /** These are the options for the assistant's voice. */
  voice?: AssistantVoice;
  
  /** This is the mode for the first message. */
  firstMessageMode?: AssistantFirstMessageMode;
  
  /** When this is enabled, no logs, recordings, or transcriptions will be stored. */
  hipaaEnabled?: boolean;
  
  /** These are the messages that will be sent to your Client SDKs. */
  clientMessages?: AssistantClientMessagesItem[];
  
  /** These are the messages that will be sent to your Server URL. */
  serverMessages?: AssistantServerMessagesItem[];
  
  /** This is the name of the assistant. */
  name?: string;
}