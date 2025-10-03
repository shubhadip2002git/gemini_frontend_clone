import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import StoreProvider from "@/lib/StoreProvider";
import { theme } from "@/lib/theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini Clone",
  description: "A Gemini-style conversational AI chat application",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body suppressHydrationWarning>
        <StoreProvider>
          <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            {children}
          </MantineProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
