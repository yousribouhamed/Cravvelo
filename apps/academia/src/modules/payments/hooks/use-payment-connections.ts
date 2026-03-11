import { useQuery } from "@tanstack/react-query";
import { getTenantPaymentConnections } from "../actions/connections.actions";

export function usePaymentConnections() {
  const query = useQuery({
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
  const activeConnections =
    query.data?.filter((connection) => connection.isActive) || [];

  return {
    ...query,
    activeConnections,
  };
}
