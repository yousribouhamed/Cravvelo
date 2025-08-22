import { useQuery } from "@tanstack/react-query";
import { getTenantPaymentConnections } from "../actions/connections.actions";

export function usePaymentConnections() {
  const query = useQuery({
    queryKey: ["tenant-payment-connections"],
    queryFn: async () => {
      console.log("Fetching payment connections...");
      const result = await getTenantPaymentConnections();
      console.log("Payment connections result:", result);

      if (!result.success) {
        throw new Error("Failed to fetch payment connections");
      }
      return result.data;
    },
    // Add some debugging options
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Payment connections error:", error);
    },
    onSuccess: (data) => {
      console.log("Payment connections loaded successfully:", data);
    },
  });

  // Filter active connections
  const activeConnections =
    query.data?.filter((connection) => connection.isActive) || [];

  console.log("Filtered active connections:", activeConnections);

  return {
    ...query,
    activeConnections,
  };
}
