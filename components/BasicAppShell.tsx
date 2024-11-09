"use client"

import { AppShell, Title, Text } from '@mantine/core';

export function BasicAppShell({ children }: { children: React.ReactNode }) {
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

        </AppShell>
    );
}
