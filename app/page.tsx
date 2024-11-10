'use client';

import { useEffect, useState } from 'react';
import { AgentCenter } from '../components/AgentCenter';
import { useMantineColorScheme } from '@mantine/core';
import Game from './game/state';
import Player, { PlayerState } from './game/player';

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
    playersSpokenInRound: []
  }))

  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (game.getState().stage === 'day') setColorScheme('light')
    if (game.getState().stage === 'night') setColorScheme('dark')
  }, [game, setColorScheme])

  useEffect(() => {
    const processPlayerSpeak = async () => {
      if (game.getState().stage === 'day') {
        console.log('here')
        await game.playerSpeak()
      }
    }

    processPlayerSpeak()
  }, [game])

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
