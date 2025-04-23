import type React from "react";
import { ConfiguracaoProvider } from "./configuracao-provider/configuracao-provider";
import { ThemeProvider } from "./theme-provider/theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
   <ThemeProvider>
    <ConfiguracaoProvider>
      {children}
    </ConfiguracaoProvider>
   </ThemeProvider> 
  );
}