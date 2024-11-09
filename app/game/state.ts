import Player from "./player";

export type GameState = {
  stage: "day" | "night";
  isGameOver: boolean;
  gameStatus: "mafia wins" | "citizens win" | "game not over";
  gameTranscript: string;
  players: Player[];
  killLog: { player: Player; round: number }[];
  currentRound: number;
};

export default class Game {
  private state: GameState;

  constructor(state: GameState) {
    this.state = state;
  }

  public addPlayer(player: Player) {
    this.state.players.push(player);
  }

  public getPlayers() {
    return this.state.players;
  }

  public getState = () => {
    return {
      stage: this.state.stage,
      isGameOver: this.state.isGameOver,
      ganeStatus: this.state.gameStatus,
      killLog: this.state.killLog,
      ganmeTranscript: this.state.gameTranscript,
      players: this.state.players.map((player) => player.getState()),
    };
  };

  public updateTranscript = (transcript: string) => {
    this.state.gameTranscript = this.state.gameTranscript + "\n" + transcript;
  };

  private pickPlayerToSpeak = () => {
    // maybe use gpt to determine who should speak

    // pick a player to speak
    return this.state.players[
      Math.floor(Math.random() * this.state.players.length)
    ];
  };

  public playerSpeak = async () => {
    const player = this.pickPlayerToSpeak();
    const textSpoken = await player.speak();

    this.updateTranscript(textSpoken);
  };

  private tallyVotesOfWhoToKill = () => {
    // tally votes to kill

    const votes = this.state.players.map((player) => {
      return player.voteToKill(this.state.players, this.state.gameTranscript);
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
    const player = this.state.players.find(
      (player) => player.getState().name === playerToKillName
    );

    if (!player) {
      return;
    }

    player.die();
    this.state.killLog.push({ player, round: this.state.killLog.length });
    this.updateTranscript("Player " + player.getState().name + " was killed");
  };

  private mafiaVoteToKill = () => {
    // mafia votes to kill
    const mafia = this.state.players.filter(
      (player) => player.getState().type === "mafia"
    );

    // mafia votes to kill, can't kill mafia
    const votes = mafia.map((player) => {
      return player.voteToKill(
        this.state.players.filter(
          (player) => player.getState().type !== "mafia"
        ),
        this.state.gameTranscript
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

    const player = this.state.players.find(
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
    this.state.killLog.push({ player, round: this.state.killLog.length });
    this.updateTranscript("Player " + player.getState().name + " was killed");
  };

  public determineIfGameOver = () => {
    const mafia = this.state.players.filter(
      (player) => player.getState().type === "mafia"
    );
    const citizens = this.state.players.filter(
      (player) => player.getState().type === "citizen"
    );

    if (mafia.length === 0) {
      this.state.isGameOver = true;
      this.state.gameStatus = "citizens win";
    } else if (mafia.length >= citizens.length) {
      this.state.isGameOver = true;
      this.state.gameStatus = "mafia wins";
    }
  };
}
