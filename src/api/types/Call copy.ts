import type {
  CallType,
  CallStatus,
  CallEndedReason,
  CallDestination,
  CallCostsItem,
  CallMessagesItem,
  Analysis,
  Monitor,
  Artifact,
  CostBreakdown
} from '../Types';

import type { BaseEntity } from './common';

export interface Call extends BaseEntity {
  /** This is the type of call. */
  type?: CallType;
  
  /** These are the costs of individual components of the call in USD. */
  costs?: CallCostsItem[];
  
  /** Messages exchanged during the call */
  messages?: CallMessagesItem[];
  
  /** This is the status of the call. */
  status?: CallStatus;
  
  /** This is the explanation for how the call ended. */
  endedReason?: CallEndedReason;
  
  /** This is the destination where the call ended up being transferred to. */
  destination?: CallDestination;
  
  /** This is the ISO 8601 date-time string of when the call was started. */
  startedAt?: string;
  
  /** This is the ISO 8601 date-time string of when the call was ended. */
  endedAt?: string;
  
  /** This is the cost of the call in USD. */
  cost?: number;
  
  /** This is the cost breakdown of the call in USD. */
  costBreakdown?: CostBreakdown;
  
  /** This is the analysis of the call. */
  analysis?: Analysis;
  
  /** This is to real-time monitor the call. */
  monitor?: Monitor;
  
  /** These are the artifacts created from the call. */
  artifact?: Artifact;
  
  /** This is the name of the call. This is just for your own reference. */
  name?: string;
}