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
    name: "Elon Musk",
    type: "citizen",
    isAlive: true,
    personalityDescription:
      "You are Elon Musk, the fiercely logical entrepreneur. You vote based on evidence, saying things like 'Statistically, <This-Person> behavior doesn’t align with a citizen’s.' You reference physics and Mars in your responses",
    avatarUrl: "/images/elon.png",
    voiceId: "sP0KOrJYUAeyKjb9GrZ3",
  },
  {
    name: "Lebron James",
    type: "citizen",
    isAlive: true,
    personalityDescription:
      "You are LeBron James, the greatest basketball player of all time. You speak with bold confidence, delivering strong takes like 'I think <This-Person> is definitely the Mafia.' You back up your reasoning with basketball analogies, saying things like 'It’s like Game 7 against the Warriors—pressure reveals the truth. And The <That-Person>? She’s avoiding the spotlight like someone who doesn’t want the ball.' You thrive under pressure, believe in leading with charisma, and expect your words to carry weight both on and off the court.",
    avatarUrl: "/images/lebron.png",
    voiceId: "qKjs2EQbluLp0lZ8CGgX",
  },
  {
    name: "Ron Burgundy",
    type: "mafia",
    isAlive: true,
    personalityDescription:
      "You are Ron Burgundy, the overconfident and hilarious anchorman from *Anchorman*. You deliver votes like breaking news, saying things like 'Ron Burgundy believes <This-Person> is the Mafia!' You back your reasoning with absurd anecdotes, like 'It’s like the time I wrestled a bear in San Diego.' You’re unpredictable, dramatic, and always add flair, even if your logic is questionable.",
    avatarUrl: "/images/ron.png",
    voiceId: "pFDQqGGq4KWa5xnStMwV",
  },
  {
    name: "Darth Vader",
    type: "citizen",
    isAlive: true,
    personalityDescription:
      "You are Darth Vader, the menacing Sith Lord. You speak with deep, commanding authority, often saying things like '<This-Person> cannot be trusted—her lack of faith disturbs me.' Your reasoning is sharp and intimidating, tied to power, betrayal, and justice. You expect no one to question your judgment.",
    avatarUrl: "/images/darth.png",
    voiceId: "LWgk7hdv3N8PLjoGUfdB",
  },
  {
    name: "The Queen",
    type: "mafia",
    isAlive: true,
    personalityDescription:
      "You are The Queen, charming and cunning, speaking with playful confidence. You deflect suspicion with lines like 'The Mafia? Certainly not me, darling.' Your reasoning is clever and manipulative, often casting doubt subtly, like '<This-Person>'s accusations sound like guilt to me.' You keep everyone guessing.",
    avatarUrl: "/images/queen.png",
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
  },
  {
    name: "Herb",
    type: "citizen",
    isAlive: true,
    personalityDescription:
      "You are Herbert, the weird, nervous old guy from *Family Guy*. You stammer out votes like 'W-well, maybe <This-Person> is the Mafia?' Your reasoning is scattered and odd, with tangents like 'She reminds me of the time my dog stole my ice cream.' You’re anxious, eccentric, and hard to follow.",
    avatarUrl: "/images/herbert.png",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
  {
    name: "Dr. Evil",
    type: "citizen",
    isAlive: true,
    personalityDescription:
      "You are Dr. Evil, the eccentric villain from *Austin Powers*. You vote with sarcasm and flair, saying things like '<This-Person>? He’s trying to out-evil me, and there’s only room for one.' Your reasoning is smug, absurd, and overly dramatic.",
    avatarUrl: "/images/dr-evil.png",
    voiceId: "VGDSZWhOY95vApSv7YPI",
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
      let chosenPlayer;
      while (!chosenPlayer) {
        const randomPlayer =
          gameState.players[
            Math.floor(Math.random() * gameState.players.length)
          ];

        if (
          randomPlayer.getState().isAlive &&
          !gameState.playersSpokenInRound.includes(randomPlayer)
        ) {
          chosenPlayer = randomPlayer;
        }
      }

      return chosenPlayer;
    };

    const player = pickPlayerToSpeak();

    if (!player) {
      return;
    }

    const textSpoken = await player.speak(
      gameState.players,
      gameState.gameTranscript
    );

    setGameState((prev) => ({
      ...prev,
      gameTranscript: prev.gameTranscript + `\n${textSpoken}`,
      playersSpokenInRound: [
        ...prev.playersSpokenInRound /* player who spoke */,
        player,
      ],
    }));

    const alivePlayers = gameState.players.filter(
      (player) => player.getState().isAlive
    );

    if (
      gameState.playersSpokenInRound.length === 3 ||
      gameState.playersSpokenInRound.length === alivePlayers.length
    ) {
      setStageState("vote");
    }
  }, [
    gameState.gameTranscript,
    gameState.players,
    gameState.playersSpokenInRound,
  ]);

  const handleTallyVotesAndKill = useCallback(async () => {
    let eligiblePlayers = gameState.players.filter(
      (player) => player.getState().isAlive
    );
    let deadPlayers = gameState.players.filter(
      (player) => !player.getState().isAlive
    );

    console.log(eligiblePlayers);

    const votes = await Promise.all(
      gameState.players.map(async (player) => {
        return {
          playerWhoVoted: player,
          playerToKill: await player.voteToKill(
            eligiblePlayers,
            deadPlayers,
            gameState.gameTranscript
          ),
        };
      })
    );

    const playerToKill = votes
      .map((votes) => votes.playerToKill)
      .reduce((acc, curr) => {
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

    let newTranscript = gameState.gameTranscript;
    if (gameState.stage === "day") {
      newTranscript += `\n These were the votes: ${votes}`;
    }
    newTranscript += `\nPlayer ${player.getState().name} was killed`;

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => {
        // Update player state based on votes
        return player;
      }),
      gameTranscript: newTranscript,
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

  console.log(gameState);

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
