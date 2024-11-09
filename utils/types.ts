export type Player = {
  name: string;
  alive: boolean;
};

export type GameState = {
  stage: "day" | "night";
  players: Player[];
  transcript: String[];
  isGameOver: boolean;
};
