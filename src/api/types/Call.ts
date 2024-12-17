import * as Vapi from "../index";

export interface Call {
  /** This is the type of call. */
  type?: Vapi.CallType;
  /** These are the costs of individual components of the call in USD. */
  costs?: Vapi.CallCostsItem[];
  messages?: Vapi.CallMessagesItem[];
  /** This is the status of the call. */
  status?: Vapi.CallStatus;
  /** This is the explanation for how the call ended. */
  endedReason?: Vapi.CallEndedReason;
  /** This is the destination where the call ended up being transferred to. */
  destination?: Vapi.CallDestination;
  /** This is the unique identifier for the call. */
  id: string;
  /** This is the unique identifier for the org that this call belongs to. */
  orgId: string;
  /** This is the ISO 8601 date-time string of when the call was created. */
  createdAt: string;
  /** This is the ISO 8601 date-time string of when the call was last updated. */
  updatedAt: string;
  /** This is the ISO 8601 date-time string of when the call was started. */
  startedAt?: string;
  /** This is the ISO 8601 date-time string of when the call was ended. */
  endedAt?: string;
  /** This is the cost of the call in USD. */
  cost?: number;
  /** This is the cost breakdown of the call in USD. */
  costBreakdown?: Vapi.CostBreakdown;
  /** This is the analysis of the call. */
  analysis?: Vapi.Analysis;
  /** This is to real-time monitor the call. */
  monitor?: Vapi.Monitor;
  /** These are the artifacts created from the call. */
  artifact?: Vapi.Artifact;
  /** This is the name of the call. This is just for your own reference. */
  name?: string;
}