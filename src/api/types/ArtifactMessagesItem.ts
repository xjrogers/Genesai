/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

export type ArtifactMessagesItem =
    | Vapi.UserMessage
    | Vapi.SystemMessage
    | Vapi.BotMessage
    | Vapi.ToolCallMessage
    | Vapi.ToolCallResultMessage;
