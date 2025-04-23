"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import * as React from "react";

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <AntdConfig>{children}</AntdConfig>
    </NextThemesProvider>
  );
}

function AntdConfig({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Aguarda o tema ser resolvido no client
  if (!mounted || !resolvedTheme) {
    return null;
  }

  const algorithm =
    resolvedTheme === "dark"
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm;

  return (
    <ConfigProvider theme={{ algorithm }}>
      {children}
    </ConfigProvider>
  );
}
