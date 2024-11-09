"use client"

import { Grid, Card, Avatar, Text, Paper } from '@mantine/core';
import { useGameState } from '../context/gamestate';

export function AgentCenter() {
    const { players, stage, isGameOver, transcript } = useGameState()

    return (
        <Grid gutter="md">
            {players.map((player, index) => (
                <Grid.Col key={index} span={4}>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Avatar></Avatar>
                        <Text>{player.name}</Text>
                        <Text>{player.alive ? "alive" : "dead"}</Text>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
}
