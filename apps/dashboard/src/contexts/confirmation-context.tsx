import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ConfirmationConfig {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

interface ConfirmationContextType {
  isOpen: boolean;
  config: ConfirmationConfig;
  onConfirm: (() => void) | null;
  openConfirmation: (config: ConfirmationConfig, onConfirm: () => void) => void;
  closeConfirmation: () => void;
  handleConfirm: () => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined
);

interface ConfirmationProviderProps {
  children: ReactNode;
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmationConfig>({});
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const openConfirmation = (
    newConfig: ConfirmationConfig,
    confirmAction: () => void
  ) => {
    setConfig({
      title: "Are you absolutely sure?",
      description: "This action cannot be undone.",
      confirmText: "Confirm",
      cancelText: "Cancel",
      variant: "default",
      ...newConfig,
    });
    setOnConfirm(() => confirmAction);
    setIsOpen(true);
  };

  const closeConfirmation = () => {
    setIsOpen(false);
    setConfig({});
    setOnConfirm(null);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    closeConfirmation();
  };

  return (
    <ConfirmationContext.Provider
      value={{
        isOpen,
        config,
        onConfirm,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
      }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmationContext = () => {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error(
      "useConfirmationContext must be used within a ConfirmationProvider"
    );
  }
  return context;
};
