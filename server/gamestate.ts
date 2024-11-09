"use server";

import { GameState } from "../utils/types";

export const getGameState = async () => {
  try {
    return {
      stage: "day",
      players: [
        {
          name: "Jake",
          alive: true,
        },
        {
          name: "Adam",
          alive: true,
        },
      ],
      transcript: [],
      isGameOver: false,
    } as GameState;
  } catch (error) {
    console.error("An error occurred while retrieving patient details:", error);
    throw error;
  }
};
