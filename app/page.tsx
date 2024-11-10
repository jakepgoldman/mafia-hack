"use client";

import { Button, Card, Flex, useMantineColorScheme } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { AgentCenter } from "../components/AgentCenter";
import Player, { PlayerState } from "./game/player";

export type Game = {
  stage: "day" | "night";
  isGameOver: boolean;
  gameStatus: string;
  gameTranscript: string;
  players: Player[];
  killLog: { player: Player; round: number }[];
  currentRound: number;
  playersSpokenInRound: Player[];
};

const stock_players: PlayerState[] = [
  {
    name: "Herbert",
    type: "mafia",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
  {
    name: "Ricky Bobby",
    type: "mafia",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
  {
    name: "Austin Powers",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
  {
    name: "Dr. Evil",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
  {
    name: "Jean Girard",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
  {
    name: "Fat Bastard",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
];

export default function HomePage() {
  const [stageState, setStageState] = useState<"speak" | "vote" | "next">(
    "speak"
  );
  const [gameState, setGameState] = useState({
    stage: "day" as "day" | "night",
    isGameOver: false,
    gameStatus: "game not over",
    gameTranscript: "",
    players: stock_players.map((p) => new Player(p)),
    killLog: [] as { player: Player; round: number }[],
    currentRound: 1,
    playersSpokenInRound: [] as Player[],
  });

  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (gameState.stage === "day") setColorScheme("light");
    if (gameState.stage === "night") setColorScheme("dark");
  }, [gameState, setColorScheme]);

  const handleGameOver = useCallback(() => {
    const mafia = gameState.players.filter(
      (player) =>
        player.getState().type === "mafia" && player.getState().isAlive
    );
    const citizens = gameState.players.filter(
      (player) =>
        player.getState().type === "citizen" && player.getState().isAlive
    );

    if (mafia.length === 0) {
      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
        gameStatus: "citizens win",
      }));
    } else if (mafia.length >= citizens.length) {
      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
        gameStatus: "mafia wins",
      }));
    }
  }, [gameState.players]);

  const handlePlayerSpeak = useCallback(async () => {
    const pickPlayerToSpeak = () => {
      if (gameState.players.length === gameState.playersSpokenInRound.length) {
        return;
      }

      let chosenPlayer;
      while (!chosenPlayer) {
        const randomPlayer =
          gameState.players[
            Math.floor(Math.random() * gameState.players.length)
          ];

        if (!gameState.playersSpokenInRound.includes(randomPlayer)) {
          chosenPlayer = randomPlayer;
        }
      }

      return chosenPlayer;
    };

    const player = pickPlayerToSpeak();

    if (!player) {
      return;
    }

    const textSpoken = await player.speak();

    setGameState((prev) => ({
      ...prev,
      gameTranscript: prev.gameTranscript + `\n${textSpoken}`,
      playersSpokenInRound: [
        ...prev.playersSpokenInRound /* player who spoke */,
      ],
    }));
    setStageState("vote");
  }, [gameState.players, gameState.playersSpokenInRound]);

  const handleTallyVotesAndKill = useCallback(() => {
    let eligiblePlayers = gameState.players.filter(
      (player) => player.getState().isAlive
    );

    // If it's night, don't kill mafia
    if (gameState.stage === "night") {
      eligiblePlayers = eligiblePlayers.filter(
        (player) => player.getState().type !== "mafia"
      );
    }

    const votes = gameState.players.map((player) => {
      return player.voteToKill(eligiblePlayers, gameState.gameTranscript);
    });

    const playerToKill = votes.reduce((acc, curr) => {
      acc[curr.getState().name] = acc[curr.getState().name] + 1 || 1;
      return acc;
    }, {} as Record<string, number>);

    const playerToKillName = Object.keys(playerToKill).reduce((acc, curr) => {
      return playerToKill[curr] > playerToKill[acc] ? curr : acc;
    });

    const player = gameState.players.find(
      (player) => player.getState().name === playerToKillName
    );

    if (!player) {
      return;
    }

    player.die();

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => {
        // Update player state based on votes
        return player;
      }),
      killLog: [...prev.killLog, { player, round: gameState.killLog.length }],
    }));

    setStageState("next");
    handleGameOver();
  }, [
    gameState.gameTranscript,
    gameState.killLog.length,
    gameState.players,
    gameState.stage,
    handleGameOver,
  ]);

  const handleUpdateStage = useCallback((newStage: "day" | "night") => {
    setGameState((prev) => ({
      ...prev,
      stage: newStage,
      currentRound:
        newStage === "day" ? prev.currentRound + 1 : prev.currentRound,
      playersSpokenInRound: newStage === "day" ? [] : prev.playersSpokenInRound,
    }));

    if (newStage === "day") {
      setStageState("speak");
    } else {
      setStageState("vote");
    }
  }, []);

  return (
    <>
      <Flex direction="column" gap={8}>
        <AgentCenter game={gameState} />

        {gameState.isGameOver && <Card>{gameState.gameStatus}</Card>}

        {!gameState.isGameOver && (
          <>
            {stageState === "speak" && gameState.stage === "day" && (
              <Button onClick={handlePlayerSpeak}>Hear someone speak</Button>
            )}

            {stageState === "vote" && gameState.stage === "day" && (
              <Button onClick={handleTallyVotesAndKill}>Vote</Button>
            )}
            {stageState === "vote" && gameState.stage === "night" && (
              <Button onClick={handleTallyVotesAndKill}>Vote</Button>
            )}

            {stageState === "next" && gameState.stage === "day" && (
              <Button onClick={() => handleUpdateStage("night")}>
                Go To Night Stage
              </Button>
            )}
            {stageState === "next" && gameState.stage === "night" && (
              <Button onClick={() => handleUpdateStage("day")}>
                Go to Day Stage
              </Button>
            )}
          </>
        )}
      </Flex>
    </>
  );
}
