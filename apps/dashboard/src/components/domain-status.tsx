"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import {
  LoadingSpinner,
  OrangeLoadingSpinner,
} from "@ui/icons/loading-spinner";
import { useDomainStatus } from "../hooks/use-domain-status";
import {
  DomainResponse,
  DomainVerificationStatusProps,
} from "../types/domain-types";
import { useEffect, useState } from "react";

type Response = {
  status: DomainVerificationStatusProps;
  domainJson: DomainResponse & { error: { code: string; message: string } };
};

export default function DomainStatus({ domain }: { domain: string }) {
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<DomainVerificationStatusProps>(
    "Pending Verification"
  );

  useEffect(() => {
    function verifyCustomDomain() {
      const interval = setInterval(async () => {
        try {
          setLoading(true); // Set loading state to true before fetch
          const response = await fetch(`/api/domain/${domain}/verify`);
          const values: Response = (await response.json()) as Response;
          setStatus(values.status);
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

  return loading ? (
    <OrangeLoadingSpinner />
  ) : status === "Valid Configuration" ? (
    <CheckCircle2
      fill="#2563EB"
      stroke="currentColor"
      className="text-black dark:text-black"
    />
  ) : status === "Pending Verification" ? (
    <AlertCircle fill="#FBBF24" stroke="currentColor" className="text-black" />
  ) : (
    <XCircle fill="#DC2626" stroke="currentColor" className="text-black" />
  );
}
