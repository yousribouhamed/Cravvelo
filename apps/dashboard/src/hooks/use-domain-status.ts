import {
  DomainResponse,
  DomainVerificationStatusProps,
} from "../types/domain-types";
import React, { useEffect, useState } from "react";

type Response = {
  status: DomainVerificationStatusProps;
  domainJson: DomainResponse & { error: { code: string; message: string } };
};

export function useDomainStatus({ domain }: { domain: string }) {
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<DomainVerificationStatusProps>(
    "Pending Verification"
  );

  const [domainJson, setDomainJson] = useState<
    DomainResponse & { error: { code: string; message: string } }
  >();

  useEffect(() => {
    function verifyCustomDomain() {
      const interval = setInterval(async () => {
        try {
          setLoading(true); // Set loading state to true before fetch
          const response = await fetch(`/api/domain/${domain}/verify`);
          const values: Response = (await response.json()) as Response;
          setStatus(values.status);
          setDomainJson(values.domainJson);
          console.log("Verification response:", values);
          // Do something with the verification values if needed
          setLoading(false); // Set loading state to false after fetch
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          setLoading(false); // Set loading state to false on error
          // Handle errors if necessary
        }
      }, 5000);

      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }

    // Call the function to start fetching every 5000 ms
    verifyCustomDomain();
  }, [domain]); // Empty dependency array to run the effect only once on mount

  return {
    status: status,
    domainJson: domainJson,
    loading: loading,
  };
}
