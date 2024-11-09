import Player from "./player";

export default class GameState {
  private stage: "day" | "night" = "day";
  private isGameOver: boolean = false;
  private ganeStatus: "mafia wins" | "citizens win" | "game not over" =
    "game not over";
  private ganmeTranscript: string = "";
  private players: Player[] = [];
  private killLog: { player: Player; round: number }[] = [];

  constructor() {}

  public addPlayer(player: Player) {
    this.players.push(player);
  }

  public getPlayers() {
    return this.players;
  }

  public getState = () => {
    return {
      stage: this.stage,
      isGameOver: this.isGameOver,
      ganeStatus: this.ganeStatus,
      killLog: this.killLog,
      ganmeTranscript: this.ganmeTranscript,
      players: this.players.map((player) => player.getState()),
    };
  };

  public updateTranscript = (transcript: string) => {
    this.ganmeTranscript = this.ganmeTranscript + "\n" + transcript;
  };

  private pickPlayerToSpeak = () => {
    // maybe use gpt to determine who should speak

    // pick a player to speak
    return this.players[Math.floor(Math.random() * this.players.length)];
  };

  public playerSpeak = async () => {
    const player = this.pickPlayerToSpeak();
    const textSpoken = await player.speak();

    this.updateTranscript(textSpoken);
  };

  private tallyVotesOfWhoToKill = () => {
    // tally votes to kill

    const votes = this.players.map((player) => {
      return player.voteToKill(this.players, this.ganmeTranscript);
    });

    // get the player with the most votes
    const playerToKill = votes.reduce((acc, curr) => {
      acc[curr.getState().name] = acc[curr.getState().name] + 1 || 1;
      return acc;
    }, {} as Record<string, number>);

    const playerToKillName = Object.keys(playerToKill).reduce((acc, curr) => {
      return playerToKill[curr] > playerToKill[acc] ? curr : acc;
    });

    return playerToKillName;
  };

  public tallyVotesAndKill = () => {
    // tally votes to kill
    const playerToKillName = this.tallyVotesOfWhoToKill();
    const player = this.players.find(
      (player) => player.getState().name === playerToKillName
    );

    if (!player) {
      return;
    }

    player.die();
    this.killLog.push({ player, round: this.killLog.length });
    this.updateTranscript("Player " + player.getState().name + " was killed");
  };

  private mafiaVoteToKill = () => {
    // mafia votes to kill
    const mafia = this.players.filter(
      (player) => player.getState().type === "mafia"
    );

    // mafia votes to kill, can't kill mafia
    const votes = mafia.map((player) => {
      return player.voteToKill(
        this.players.filter((player) => player.getState().type !== "mafia"),
        this.ganmeTranscript
      );
    });

    // get the player with the most votes
    const playerToKill = votes.reduce((acc, curr) => {
      acc[curr.getState().name] = acc[curr.getState().name] + 1 || 1;
      return acc;
    }, {} as Record<string, number>);

    const playerToKillName = Object.keys(playerToKill).reduce((acc, curr) => {
      return playerToKill[curr] > playerToKill[acc] ? curr : acc;
    });

    return playerToKillName;
  };

  public mafiaKill = () => {
    // mafia votes to kill
    const playerToKillName = this.mafiaVoteToKill();

    const player = this.players.find(
      (player) => player.getState().name === playerToKillName
    );

    if (!player) {
      return;
    }

    // mafia can't kill mafia
    if (player.getState().type === "mafia") {
      return;
    }

    // kill the player
    player.die();
    this.killLog.push({ player, round: this.killLog.length });
    this.updateTranscript("Player " + player.getState().name + " was killed");
  };

  public determineIfGameOver = () => {
    const mafia = this.players.filter(
      (player) => player.getState().type === "mafia"
    );
    const citizens = this.players.filter(
      (player) => player.getState().type === "citizen"
    );

    if (mafia.length === 0) {
      this.isGameOver = true;
      this.ganeStatus = "citizens win";
    } else if (mafia.length >= citizens.length) {
      this.isGameOver = true;
      this.ganeStatus = "mafia wins";
    }
  };
}
