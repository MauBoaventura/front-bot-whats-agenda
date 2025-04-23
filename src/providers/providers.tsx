import type React from "react";
import { ThemeProvider } from "./theme-provider/theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
   <ThemeProvider>
      {children}
   </ThemeProvider> 
  );
}