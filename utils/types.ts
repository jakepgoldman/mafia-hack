export type Player = {
  name: string;
  alive: boolean;
};

// export type GameState = {
//   stage: "day" | "night";
//   players: Player[];
//   transcript: String[];
//   isGameOver: boolean;
// };

export type GameState = {
  stage: "day" | "night";
  isGameOver: boolean;
  gameStatus: "mafia wins" | "citizens win" | "game not over";
  gameTranscript: string;
  players: Player[];
  killLog: { player: Player; round: number }[];
  currentRound: number;
};
