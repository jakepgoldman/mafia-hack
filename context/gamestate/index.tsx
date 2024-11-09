"use client";

import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

import { GameState } from '../../utils/types'

import { useGetGameState } from "../../hooks/useGetGameState";

const GameStateContext = createContext<GameState | undefined>(
  undefined,
);

interface GameStateContextProviderProps {
  children: ReactNode;
}

const GameStateContextProvider: FunctionComponent<
  GameStateContextProviderProps
> = ({ children }) => {
  const [gs, setGs] = useState<GameState | null>(null);

  const { gameState } = useGetGameState();
  useEffect(() => {
    if (gameState) {
      setGs(gameState);
    }
  }, [gameState]);

  return (
    <GameStateContext.Provider
      value={{
        stage: gs?.stage || "day",
        players: gs?.players || [],
        transcript: gs?.transcript || [],
        isGameOver: gs?.isGameOver || false
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

function useGameState(): GameState {
  const context = useContext(GameStateContext);

  if (context === undefined) {
    throw new Error(
      "useGameState must be used within a GameStateContextProvider",
    );
  }
  return context;
}

export { GameStateContextProvider, useGameState };
