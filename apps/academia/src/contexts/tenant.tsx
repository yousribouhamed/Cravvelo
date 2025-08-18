"use client";

import { createContext, useContext, ReactNode } from "react";
import { TenantWebsite } from "@/actions/tanant";
import type { JWTPayload } from "@/modules/auth/lib/jwt";

interface TenantContextType {
  website: TenantWebsite;
  tenant: string;
  user: JWTPayload | null;
}

const TenantContext = createContext<TenantContextType | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  website: TenantWebsite;
  tenant: string;
  user: JWTPayload | null;
}

export function TenantProvider({
  children,
  website,
  tenant,
  user,
}: TenantProviderProps) {
  return (
    <TenantContext.Provider value={{ website, tenant, user }}>
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
