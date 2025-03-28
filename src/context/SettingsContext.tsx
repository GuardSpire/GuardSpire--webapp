import React, { createContext, useContext, useState, ReactNode } from 'react';

type Position = {
    anchor: string; top: number; left: number 
};

type SettingsContextType = {
  isOpen: boolean;
  position: Position | null;
  setIsOpen: (open: boolean) => void;
  setPosition: (pos: Position) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  return (
    <SettingsContext.Provider value={{ isOpen, position, setIsOpen, setPosition }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
