import { ElevenLabsClient, play } from "elevenlabs";
import * as dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const createAudioStreamFromText = async (text: string, voiceId: string): Promise<Blob> => {
  const audioStream = await client.generate({
    voice: voiceId,
    model_id: "eleven_turbo_v2_5",
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);

  // Convert Buffer to Blob
  return new Blob([content], { type: "audio/mpeg" });
};

