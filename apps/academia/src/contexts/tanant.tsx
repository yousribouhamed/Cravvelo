"use client";

import { createContext, useContext, ReactNode } from "react";
import { TenantWebsite } from "@/actions/tanant";

interface TenantContextType {
  website: TenantWebsite;
  tenant: string;
}

const TenantContext = createContext<TenantContextType | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  website: TenantWebsite;
  tenant: string;
}

export function TenantProvider({
  children,
  website,
  tenant,
}: TenantProviderProps) {
  return (
    <TenantContext.Provider value={{ website, tenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
