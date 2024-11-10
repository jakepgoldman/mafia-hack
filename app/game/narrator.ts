import openAIClient from "../clients/openai";
import { createPlayerKilledStory } from "../prompts/NarratorPrompt";
import { createAudioStreamFromText } from "../utils/tts_service";
import Player from "./player";

export type NarratorState = {
    voiceId: string
}

export default class Narrator {
    private state: NarratorState;

    constructor(state: NarratorState) {
        this.state = state;
    }

    public getState = () => {
        return this.state;
    };

    public async narrateDeathEvent(killedPlayerName: string, remainingPlayers: Player[], transcript: string) {
        const { systemMessage, userPrompt } = createPlayerKilledStory(
            killedPlayerName,
            remainingPlayers.map((player) => player.getState().name),
            transcript
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

        const parsed = JSON.parse(value) as any as { narration: string };

        console.log("[speak] Speech sent to text-to-speech service:", parsed.narration);
        await this.callTextToSpeech(parsed.narration);
    };
    
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

}