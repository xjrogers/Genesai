/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

export interface ServerMessageAssistantRequest {
    /**
     * This is the phone number associated with the call.
     *
     * This matches one of the following:
     *
     * - `call.phoneNumber`,
     * - `call.phoneNumberId`.
     */
    phoneNumber?: Vapi.ServerMessageAssistantRequestPhoneNumber;
    /** This is the type of the message. "assistant-request" is sent to fetch assistant configuration for an incoming call. */
    type: "assistant-request";
    /** This is the ISO-8601 formatted timestamp of when the message was sent. */
    timestamp?: string;
    /**
     * This is a live version of the `call.artifact`.
     *
     * This matches what is stored on `call.artifact` after the call.
     */
    artifact?: Vapi.Artifact;
    /**
     * This is the assistant that is currently active. This is provided for convenience.
     *
     * This matches one of the following:
     *
     * - `call.assistant`,
     * - `call.assistantId`,
     * - `call.squad[n].assistant`,
     * - `call.squad[n].assistantId`,
     * - `call.squadId->[n].assistant`,
     * - `call.squadId->[n].assistantId`.
     */
    assistant?: Vapi.CreateAssistantDto;
    /**
     * This is the customer associated with the call.
     *
     * This matches one of the following:
     *
     * - `call.customer`,
     * - `call.customerId`.
     */
    customer?: Vapi.CreateCustomerDto;
    /**
     * This is the call object.
     *
     * This matches what was returned in POST /call.
     *
     * Note: This might get stale during the call. To get the latest call object, especially after the call is ended, use GET /call/:id.
     */
    call?: Vapi.Call;
}
