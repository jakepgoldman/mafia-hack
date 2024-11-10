"use client";

import { Avatar, Card, Grid, Text } from "@mantine/core";
import { Game } from "../app/page";

export function AgentCenter({ game }: { game: Game }) {

    const handleClick = (player) => {
        player.speak();

    }
    return (
        <Grid gutter="md">
            {game.getPlayers().map((player, index) => (
                <Grid.Col key={index} span={4}>

                    <Card onClick={() => handleClick(player)} shadow="sm" padding="lg" radius="md" withBorder>
                        <Avatar
                            src={player.getState().avatarUrl}
                            size="xl"
                            styles={{
                                image: {
                                    objectFit: 'cover',       // Ensures the image fills the container
                                    objectPosition: 'center', // Adjusts the cropping focus
                                },
                            }}
                        />
                        <Text>{player.getState().name}</Text>
                        <Text>{player.getState().isAlive ? "alive" : "dead"}</Text>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
}
