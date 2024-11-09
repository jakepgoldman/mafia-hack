"use client";

import { createTheme, MantineProvider, MantineThemeOverride } from "@mantine/core";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const theme: MantineThemeOverride = createTheme({
    /* Put your mantine theme override here */
});

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
                {children}
            </MantineProvider>
        </QueryClientProvider>
    );
};
