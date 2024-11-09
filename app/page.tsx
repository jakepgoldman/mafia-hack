'use client';

import { useEffect, useState } from 'react';
import { AgentCenter } from '../components/AgentCenter';
import { useMantineColorScheme } from '@mantine/core';
import Game from './game/state';
import Player, { PlayerState } from './game/player';

const stock_players: PlayerState[] = [
  {
    name: "Jason Bourne",
    type: "mafia",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "",
  },
  {
    name: "Ricky Bobby",
    type: "mafia",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "",
  },
  {
    name: "Austin Powers",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "",
  },
  {
    name: "Dr. Evil",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "",
  },
  {
    name: "Jean Girard",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "",
  },
  {
    name: "Fat Bastard",
    type: "citizen",
    isAlive: true,
    personalityDescription: "James Bond but not actually",
    avatarUrl: "",
    voiceId: "",
  }
]

export default function HomePage() {
  const [game, setGame] = useState<Game>(new Game({
    stage: "day",
    isGameOver: false,
    gameStatus: "game not over",
    gameTranscript: "",
    players: stock_players.map(p => new Player(p)),
    killLog: [],
    currentRound: 1,
  }))

  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (game.getState().stage === 'day') setColorScheme('light')
    if (game.getState().stage === 'night') setColorScheme('dark')
  }, [game, setColorScheme])



  return (
    <>
      <AgentCenter game={game} />

      {/* <Group p="md" justify="space-between">
        <Badge>
          Your role: Mafia
        </Badge>
        <Badge color={stage === 'day' ? 'grape' : 'yellow'}>
          {stage}
        </Badge>
      </Group> */}
    </>
  );
}
