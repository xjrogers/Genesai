/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

/**
 * This is the phone number associated with the call.
 *
 * This matches one of the following:
 *
 * - `call.phoneNumber`,
 * - `call.phoneNumberId`.
 */
export type ServerMessageTransferDestinationRequestPhoneNumber =
    | Vapi.CreateByoPhoneNumberDto
    | Vapi.CreateTwilioPhoneNumberDto
    | Vapi.CreateVonagePhoneNumberDto
    | Vapi.CreateVapiPhoneNumberDto;
