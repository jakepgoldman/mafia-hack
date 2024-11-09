"use client"

import { Grid, Card, Avatar, Text, Paper } from '@mantine/core';
import Game from '../app/game/state';

export function AgentCenter({ game }: { game: Game }) {

    return (
        <Grid gutter="md">
            {game.getPlayers().map((player, index) => (
                <Grid.Col key={index} span={4}>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Avatar></Avatar>
                        <Text>{player.getState().name}</Text>
                        <Text>{player.getState().isAlive ? "alive" : "dead"}</Text>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
}
