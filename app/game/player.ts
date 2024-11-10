import { createAudioStreamFromText } from "../utils/tts_service";

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

  public voteToKill: (players: Player[], transcript: string) => Player = (
    players
  ) => {
    // prompt gpt to ask for a player to vote for based on game context

    // get the player to vote for to kill
    return players[0];
  };

  public nominateToKill: (players: Player[], transcript: string) => Player = (
    players
  ) => {
    // prompt gpt to ask for a player to vote for based on game context

    // get the player to vote for to save
    return players[0];
  };

  public speak = async () => {
    // prompt gpt to determine what to say based on transcript so far, if picked to speak

    await this.callTextToSpeech("Hello mate!");

    return "TEXT FROM GPT";
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
