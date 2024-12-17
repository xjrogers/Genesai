/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

export interface AzureOpenAiCredential {
    provider: "azure-openai";
    region: Vapi.AzureOpenAiCredentialRegion;
    models: Vapi.AzureOpenAiCredentialModelsItem[];
    /** This is not returned in the API. */
    openAIKey: string;
    /** This is the unique identifier for the credential. */
    id: string;
    /** This is the unique identifier for the org that this credential belongs to. */
    orgId: string;
    /** This is the ISO 8601 date-time string of when the credential was created. */
    createdAt: string;
    /** This is the ISO 8601 date-time string of when the assistant was last updated. */
    updatedAt: string;
    openAIEndpoint: string;
}
