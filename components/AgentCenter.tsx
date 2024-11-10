"use client";

import { Avatar, Card, Grid, Text, Stack } from "@mantine/core";
import Player from "../app/game/player";
import { Game } from "../app/page";

export function AgentCenter({ game }: { game: Game }) {
    const handleClick = (player: Player) => {
        player.introduce(game.players)
    };
    return (
        <Grid gutter="md">
            {game.players.map((player, index) => (
                <Grid.Col key={index} span={4}>
                    <Card
                        onClick={() => handleClick(player)}
                        padding="lg"
                        radius="md"
                    >
                        <Stack align="center" justify="center">
                            <Avatar
                                src={player.getState().avatarUrl}
                                size={200}
                                styles={{
                                    image: {
                                        objectFit: "cover", // Ensures the image fills the container
                                        objectPosition: "center", // Adjusts the cropping focus
                                        filter: player.getState().isAlive ? '' : 'brightness(0.3)',
                                    },
                                    root: {
                                        border: game.playerSpeaking === player ? '8px solid #228be6' : 'none',
                                    }
                                }}
                            />
                            <Text>{player.getState().name}</Text>
                        </Stack>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
}
