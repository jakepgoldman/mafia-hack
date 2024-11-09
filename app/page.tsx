'use client';

import { useEffect } from 'react';
import { AgentCenter } from '../components/AgentCenter';
import { useGameState } from '../context/gamestate';
import { useMantineColorScheme } from '@mantine/core';

export default function HomePage() {
  const { players, stage, isGameOver, transcript } = useGameState()
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (stage === 'day') setColorScheme('light')
    if (stage === 'night') setColorScheme('dark')
  }, [stage, setColorScheme])

  return (
    <>
      <AgentCenter />

    </>
  );
}
