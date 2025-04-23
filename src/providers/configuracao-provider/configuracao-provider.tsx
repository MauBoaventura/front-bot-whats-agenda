"use client"
import { createContext, useContext, useEffect, useState } from "react";

// Define o tipo do contexto
interface ConfiguracaoContextType {
  collapsedSidebar: boolean;
  setCollapsedSidebar: (items: boolean) => void;
}

// Cria o contexto
const ConfiguracaoContext = createContext<ConfiguracaoContextType | undefined>(undefined);

// Hook personalizado para usar o contexto de collapsedSidebar
export const useConfiguracao = () => {
  const context = useContext(ConfiguracaoContext);
  if (!context) {
    throw new Error("useConfiguracao deve ser usado dentro de um ConfiguracaoProvider");
  }
  return context;
};

// Hook personalizado para gerenciar o estado dos collapsedSidebar com localStorage
const useConfiguracaoState = (): ConfiguracaoContextType => {
  const [collapsedSidebar, setCollapsedSidebar] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Recupera os collapsedSidebar do localStorage ao inicializar
      const savedConfiguracao = localStorage.getItem("collapsedSidebar");
      return savedConfiguracao ? savedConfiguracao === "true" : false;
    }
    return false; // Valor padrão se localStorage não estiver disponível
  });

  // Atualiza o localStorage sempre que os collapsedSidebar mudam
  useEffect(() => {
    localStorage.setItem("collapsedSidebar", collapsedSidebar.toString());
  }, [collapsedSidebar]);

  return { collapsedSidebar, setCollapsedSidebar };
};

// Provider para o contexto de collapsedSidebar
export const ConfiguracaoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collapsedSidebar, setCollapsedSidebar } = useConfiguracaoState();

  return (
    <ConfiguracaoContext.Provider value={{ collapsedSidebar, setCollapsedSidebar }}>
      {children}
    </ConfiguracaoContext.Provider>
  );
};