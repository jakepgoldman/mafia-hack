import "@mantine/core/styles.css";
import React from "react";
import { ColorSchemeScript } from "@mantine/core";
import { BasicAppShell } from "../components/BasicAppShell";
import { Providers } from "./providers";

export const metadata = {
  title: "Mafia Hackathon",
  description: "A super weird mystery",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers>
          <BasicAppShell>
            {children}
          </BasicAppShell>
        </Providers>
      </body>
    </html >
  );
}
