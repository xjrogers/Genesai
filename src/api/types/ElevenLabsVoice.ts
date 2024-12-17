/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Vapi from "../index";

export interface ElevenLabsVoice {
    /**
     * This determines whether fillers are injected into the model output before inputting it into the voice provider.
     *
     * Default `false` because you can achieve better results with prompting the model.
     */
    fillerInjectionEnabled?: boolean;
    /** This is the voice provider that will be used. */
    provider: "11labs";
    /** This is the provider-specific ID that will be used. Ensure the Voice is present in your 11Labs Voice Library. */
    voiceId: Vapi.ElevenLabsVoiceId;
    /** Defines the stability for voice settings. */
    stability?: number;
    /** Defines the similarity boost for voice settings. */
    similarityBoost?: number;
    /** Defines the style for voice settings. */
    style?: number;
    /** Defines the use speaker boost for voice settings. */
    useSpeakerBoost?: boolean;
    /** Defines the optimize streaming latency for voice settings. Defaults to 3. */
    optimizeStreamingLatency?: number;
    /**
     * This enables the use of https://elevenlabs.io/docs/speech-synthesis/prompting#pronunciation. Defaults to false to save latency.
     *
     * @default false
     */
    enableSsmlParsing?: boolean;
    /** This is the model that will be used. Defaults to 'eleven_turbo_v2' if not specified. */
    model?: Vapi.ElevenLabsVoiceModel;
    /** This is the language (ISO 639-1) that is enforced for the model. Currently only Turbo v2.5 supports language enforcement. For other models, an error will be returned if language code is provided. */
    language?: string;
    /** This is the plan for chunking the model output before it is sent to the voice provider. */
    chunkPlan?: Vapi.ChunkPlan;
}
