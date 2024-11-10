import OpenAI from "openai";
import { env } from "../env";

const openAIClient = new OpenAI({
  apiKey: env.OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default openAIClient;
