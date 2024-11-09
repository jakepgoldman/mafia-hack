import { play } from "elevenlabs";
import { elevenLabsClient } from "../clients/11labs";

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

    await this.callTextToSpeech("TODO: get text from gpt");

    return "TEXT FROM GPT";
  };

  // call this
  private callTextToSpeech = async (text: string) => {
    return await elevenLabsClient.generate({
      voice: this.state.voiceId,
      text,
    });
  };

  // tood stt for the player
}
