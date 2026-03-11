import {
  DomainResponse,
  DomainVerificationStatusProps,
} from "../types/domain-types";
import { useEffect, useState } from "react";

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
    if (!domain) return;

    let isCancelled = false;

    const verifyCustomDomain = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/domain/${encodeURIComponent(domain)}/verify`
        );
        const values: Response = (await response.json()) as Response;

        if (!isCancelled) {
          setStatus(values.status);
          setDomainJson(values.domainJson);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    verifyCustomDomain();
    const interval = setInterval(verifyCustomDomain, 5000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [domain]);

  return {
    status,
    domainJson,
    loading,
  };
}
