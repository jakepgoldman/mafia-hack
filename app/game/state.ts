import Player from "./player";

export type GameState = {
  stage: "day" | "night";
  isGameOver: boolean;
  gameStatus: "mafia wins" | "citizens win" | "game not over";
  gameTranscript: string;
  players: Player[];
  killLog: { player: Player; round: number }[];
  currentRound: number;
  playersSpokenInRound: Player[];
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
    return { ...this.state };
  };

  public updateStage = (stage: "day" | "night") => {
    this.state = {
      ...this.state,
      stage,
    };
  };

  public updateTranscript = (transcript: string) => {
    this.state = {
      ...this.state,
      gameTranscript: this.state.gameTranscript + "\n" + transcript,
    };
  };

  public addPlayerSpokenInRound = (player: Player) => {
    this.state = {
      ...this.state,
      playersSpokenInRound: [...this.state.playersSpokenInRound, player],
    };
  };

  public pickPlayerToSpeak = () => {
    if (this.state.players.length === this.state.playersSpokenInRound.length) {
      return;
    }

    let chosenPlayer;
    while (!chosenPlayer) {
      const randomPlayer =
        this.state.players[
          Math.floor(Math.random() * this.state.players.length)
        ];

      if (!this.state.playersSpokenInRound.includes(randomPlayer)) {
        chosenPlayer = randomPlayer;
      }
    }

    return chosenPlayer;
  };

  public playerSpeak = async () => {
    const player = this.pickPlayerToSpeak();

    if (!player) {
      return;
    }

    const textSpoken = await player.speak();

    this.updateTranscript(textSpoken);
    this.addPlayerSpokenInRound(player);
  };

  public tallyVotesOfWhoToKill = () => {
    const votes = this.state.players.map((player) => {
      return player.voteToKill(this.state.players, this.state.gameTranscript);
    });

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
    const playerToKillName = this.tallyVotesOfWhoToKill();
    const player = this.state.players.find(
      (player) => player.getState().name === playerToKillName
    );

    if (!player) {
      return;
    }

    player.die();
    this.state = {
      ...this.state,
      killLog: [
        ...this.state.killLog,
        { player, round: this.state.killLog.length },
      ],
      players: this.state.players.map((p) =>
        p.getState().name === player.getState().name ? player : p
      ),
    };
    this.updateTranscript("Player " + player.getState().name + " was killed");
  };

  private mafiaVoteToKill = () => {
    const mafia = this.state.players.filter(
      (player) => player.getState().type === "mafia"
    );

    const votes = mafia.map((player) => {
      return player.voteToKill(
        this.state.players.filter(
          (player) => player.getState().type !== "mafia"
        ),
        this.state.gameTranscript
      );
    });

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
    const playerToKillName = this.mafiaVoteToKill();

    const player = this.state.players.find(
      (player) => player.getState().name === playerToKillName
    );

    if (!player) {
      return;
    }

    if (player.getState().type === "mafia") {
      return;
    }

    player.die();
    this.state = {
      ...this.state,
      killLog: [
        ...this.state.killLog,
        { player, round: this.state.killLog.length },
      ],
      players: this.state.players.map((p) =>
        p.getState().name === player.getState().name ? player : p
      ),
    };
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
      this.state = {
        ...this.state,
        isGameOver: true,
        gameStatus: "citizens win",
      };
    } else if (mafia.length >= citizens.length) {
      this.state = {
        ...this.state,
        isGameOver: true,
        gameStatus: "mafia wins",
      };
    }
  };
}
