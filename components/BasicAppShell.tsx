"use client"

import { AppShell, Burger, Group, Title, Text, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useGameState } from '../context/gamestate';

export function BasicAppShell({ children }: { children: React.ReactNode }) {
    const { stage } = useGameState()


    return (
        <AppShell
            header={{ height: 60 }}
            footer={{ height: 60, }}
            padding="md"
        >
            <AppShell.Header>
                <Title>
                    <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
                        Mafia
                    </Text>
                </Title>
            </AppShell.Header>
            <AppShell.Main>{children}</AppShell.Main>
            <AppShell.Footer>
                <Group p="md" justify="space-between">
                    <Badge>
                        Your role: Mafia
                    </Badge>
                    <Badge color={stage === 'day' ? 'grape' : 'yellow'}>
                        {stage}
                    </Badge>
                </Group>
            </AppShell.Footer>
        </AppShell>
    );
}
