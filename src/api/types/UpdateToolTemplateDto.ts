/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

export interface UpdateToolTemplateDto {
    details?: Vapi.UpdateToolTemplateDtoDetails;
    providerDetails?: Vapi.UpdateToolTemplateDtoProviderDetails;
    metadata?: Vapi.ToolTemplateMetadata;
    visibility?: Vapi.UpdateToolTemplateDtoVisibility;
    type: "tool";
    /** The name of the template. This is just for your own reference. */
    name?: string;
    provider?: Vapi.UpdateToolTemplateDtoProvider;
}
