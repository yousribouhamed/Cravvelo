"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getTenantPaymentConnections } from "../actions/connections.actions";
import {
  PaymentContextState,
  PaymentProduct,
} from "@/modules/payments/types/index";

const DEFAULT_PRODUCT: PaymentProduct = {
  id: "course-1",
  name: "دورة البرمجة الشاملة",
  description: "دورة متكاملة لتعلم البرمجة من الصفر",
  price: 5000,
  currency: "د.ج",
  type: "COURSE",
};

const PaymentContext = createContext<PaymentContextState | undefined>(
  undefined
);

// Provider Props
interface PaymentProviderProps {
  children: ReactNode;
  defaultProduct?: PaymentProduct;
}

export function PaymentProvider({
  children,
  defaultProduct = DEFAULT_PRODUCT,
}: PaymentProviderProps) {
  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Product state
  const [selectedProduct, setSelectedProduct] = useState<PaymentProduct | null>(
    defaultProduct
  );

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("chargily");

  // Loading states
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Payment connections query
  const {
    data: connections = [],
    isLoading: isConnectionsLoading,
    refetch: refetchConnections,
  } = useQuery({
    queryKey: ["tenant-payment-connections"],
    queryFn: async () => {
      const result = await getTenantPaymentConnections();
      if (!result.success) {
        throw new Error("Failed to fetch payment connections");
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Filter active connections
  const activeConnections = connections?.filter(
    (connection) => connection.isActive
  );

  // Sheet handlers
  const openSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);
  const setSheetOpen = useCallback((open: boolean) => setIsSheetOpen(open), []);

  // Loading handlers
  const setCheckoutLoading = useCallback((loading: boolean) => {
    setIsCheckoutLoading(loading);
  }, []);

  const setFormSubmitting = useCallback((submitting: boolean) => {
    setIsFormSubmitting(submitting);
  }, []);

  const setNormalizedPaymentMethod = useCallback((method: string) => {
    setPaymentMethod(method.toLowerCase());
  }, []);

  // Helper methods
  const hasActiveConnection = useCallback(
    (provider: string) => {
      return activeConnections?.some(
        (conn) => conn.provider.toLowerCase() === provider.toLowerCase()
      );
    },
    [activeConnections]
  );

  const getActiveConnection = useCallback(
    (provider: string) => {
      return activeConnections?.find(
        (conn) => conn.provider.toLowerCase() === provider.toLowerCase()
      );
    },
    [activeConnections]
  );

  // Reset payment state
  const resetPaymentState = useCallback(() => {
    setPaymentMethod("chargily");
    setIsCheckoutLoading(false);
    setIsFormSubmitting(false);
    setFormData({});
  }, []);

  // Form data handlers
  const updateFormData = useCallback((key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFormData = useCallback(() => {
    setFormData({});
  }, []);

  // Auto-select first available payment method when connections change
  React.useEffect(() => {
    if (activeConnections?.length > 0 && !hasActiveConnection(paymentMethod)) {
      const firstConnection = activeConnections ? activeConnections[0] : null;
      if (firstConnection) {
        setPaymentMethod(firstConnection?.provider.toLowerCase());
      }
    }
  }, [activeConnections, paymentMethod, hasActiveConnection]);

  const contextValue: PaymentContextState = {
    // Sheet state
    isSheetOpen,
    openSheet,
    closeSheet,
    setSheetOpen,

    // Product state
    selectedProduct,
    setSelectedProduct,

    // Payment method state
    paymentMethod,
    setPaymentMethod: setNormalizedPaymentMethod,

    // Loading states
    isCheckoutLoading,
    setCheckoutLoading,
    isFormSubmitting,
    setFormSubmitting,

    // Connections data
    connections,
    activeConnections,
    isConnectionsLoading,

    refetchConnections,

    // Helper methods
    hasActiveConnection,
    getActiveConnection,
    resetPaymentState,

    // Form data
    formData,
    updateFormData,
    clearFormData,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
}
