/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

export interface CreateGcpCredentialDto {
    provider: "gcp";
    /** This is the name of the GCP credential. This is just for your reference. */
    name?: string;
    /**
     * This is the GCP key. This is the JSON that can be generated in the Google Cloud Console at https://console.cloud.google.com/iam-admin/serviceaccounts/details/<service-account-id>/keys.
     *
     * The schema is identical to the JSON that GCP outputs.
     */
    gcpKey: Vapi.GcpKey;
    /** This is the bucket plan that can be provided to store call artifacts in GCP. */
    bucketPlan?: Vapi.BucketPlan;
}
