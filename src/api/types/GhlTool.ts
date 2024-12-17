/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

export interface GhlTool {
    /**
     * This determines if the tool is async.
     *
     * If async, the assistant will move forward without waiting for your server to respond. This is useful if you just want to trigger something on your server.
     *
     * If sync, the assistant will wait for your server to respond. This is useful if want assistant to respond with the result from your server.
     *
     * Defaults to synchronous (`false`).
     */
    async?: boolean;
    /**
     * These are the messages that will be spoken to the user as the tool is running.
     *
     * For some tools, this is auto-filled based on special fields like `tool.destinations`. For others like the function tool, these can be custom configured.
     */
    messages?: Vapi.GhlToolMessagesItem[];
    type: "ghl";
    /** This is the unique identifier for the tool. */
    id: string;
    /** This is the unique identifier for the organization that this tool belongs to. */
    orgId: string;
    /** This is the ISO 8601 date-time string of when the tool was created. */
    createdAt: string;
    /** This is the ISO 8601 date-time string of when the tool was last updated. */
    updatedAt: string;
    /**
     * This is the function definition of the tool.
     *
     * For `endCall`, `transferCall`, and `dtmf` tools, this is auto-filled based on tool-specific fields like `tool.destinations`. But, even in those cases, you can provide a custom function definition for advanced use cases.
     *
     * An example of an advanced use case is if you want to customize the message that's spoken for `endCall` tool. You can specify a function where it returns an argument "reason". Then, in `messages` array, you can have many "request-complete" messages. One of these messages will be triggered if the `messages[].conditions` matches the "reason" argument.
     */
    function?: Vapi.OpenAiFunction;
    /**
     * This is the server that will be hit when this tool is requested by the model.
     *
     * All requests will be sent with the call object among other things. You can find more details in the Server URL documentation.
     *
     * This overrides the serverUrl set on the org and the phoneNumber. Order of precedence: highest tool.server.url, then assistant.serverUrl, then phoneNumber.serverUrl, then org.serverUrl.
     */
    server?: Vapi.Server;
    metadata: Vapi.GhlToolMetadata;
}
