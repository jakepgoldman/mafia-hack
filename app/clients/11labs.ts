import { ElevenLabsClient } from "elevenlabs";

import { env } from "../env/index.js";

export const elevenLabsClient = new ElevenLabsClient({
  apiKey: env.ELEVENLABS_API_KEY,
});
