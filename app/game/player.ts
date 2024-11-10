import openAIClient from "../clients/openai";
import { createSpeechPrompt } from "../prompts/SpeakPrompt";
import { createAudioStreamFromText } from "../utils/tts_service";
import { createNominatePrompt } from "../prompts/NominatePrompt";

export type PlayerState = {
  name: string;
  type: "mafia" | "citizen";
  isAlive: boolean;
  personalityDescription: string;
  avatarUrl: string;
  voiceId: string;
};

export default class Player {
  private state: PlayerState;

  constructor(state: PlayerState) {
    this.state = state;
  }

  public getState = () => {
    return this.state;
  };

  public die = () => {
    this.state.isAlive = false;
  };

  public async voteToKill(players: Player[], transcript: string): Promise<Player> {
    // prompt gpt to ask for a player to vote for based on game context

    // get the player to vote for to kill
    const { name, type, personalityDescription } = this.state;

    const { systemMessage, userPrompt } = createNominatePrompt(
      name,
      type,
      personalityDescription,
      transcript,
      players.map((player) => player.getState().name)
    );

    const data = await openAIClient.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const value = data.choices[0].message.content;
    if (value == null) {
      throw new Error("no content")
    }

    const parsed = JSON.parse(value) as any as { reason: string, nomination: string };

    console.log("[speak] OpenAI API response:", data);

    const player = players.find((p: Player) => player.getState().name);
    return player;
  };

  public speak = async (players: Player[], transcript: string) => {
    try {
      // Log the start of the function
      console.log("[speak] Function invoked with parameters:", { players, transcript });

      // Extract the current state
      const { name, type, personalityDescription } = this.state;
      console.log("[speak] Current state:", { name, type, personalityDescription });

      // Create the GPT prompt
      const [systemMessage, userPrompt] = createSpeechPrompt(
        name,
        type,
        personalityDescription,
        transcript,
        players.map((player) => player.getState().name)
      );
      console.log("[speak] Generated system message and user prompt:", { systemMessage, userPrompt });

      // Call the OpenAI API
      const data = await openAIClient.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });
      console.log("[speak] OpenAI API response:", data);

      // Extract and log the speech output
      const value = data.choices[0].message.content;
      if (value == null) {
        throw new Error("no content")
      }

      const parsed = JSON.parse(value) as any as { reason: string, speech: string };
      console.log("[speak] Extracted response:", value);

      // Call text-to-speech with the generated speech
      await this.callTextToSpeech(parsed.speech);
      console.log("[speak] Speech sent to text-to-speech service:", parsed.speech);

      return parsed.speech;
    } catch (error) {
      // Log errors
      console.error("[speak] Error encountered:", error);
      throw error;
    }
  };


  // call this
  private async callTextToSpeech(text: string): Promise<void> {
    try {
      // Use the createAudioStreamFromText function
      const { voiceId } = this.state;

      const audioBlob = await createAudioStreamFromText(text, voiceId);

      // Create a URL for the audio Blob
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio using the Audio API
      const audio = new Audio(audioUrl);
      audio.play();

      // Revoke the Blob URL after the audio finishes playing
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error("Error during text-to-speech:", error);
    }
  }

  // tood stt for the player
}
