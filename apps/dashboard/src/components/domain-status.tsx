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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";

type Response = {
  status: DomainVerificationStatusProps;
  domainJson: DomainResponse & { error: { code: string; message: string } };
};

const statusConfig = {
  "Valid Configuration": {
    icon: CheckCircle2,
    fillClass: "fill-blue-500 dark:fill-blue-400",
    strokeClass: "text-white dark:text-gray-900",
    tooltip: "Domain is properly configured",
  },
  "Pending Verification": {
    icon: AlertCircle,
    fillClass: "fill-yellow-500 dark:fill-yellow-400",
    strokeClass: "text-white dark:text-gray-900",
    tooltip: "Waiting for DNS verification",
  },
  "Invalid Configuration": {
    icon: XCircle,
    fillClass: "fill-red-500 dark:fill-red-400",
    strokeClass: "text-white dark:text-gray-900",
    tooltip: "Domain configuration is invalid",
  },
  "Domain Not Found": {
    icon: XCircle,
    fillClass: "fill-red-500 dark:fill-red-400",
    strokeClass: "text-white dark:text-gray-900",
    tooltip: "Domain not found on Vercel",
  },
  "Unknown Error": {
    icon: XCircle,
    fillClass: "fill-red-500 dark:fill-red-400",
    strokeClass: "text-white dark:text-gray-900",
    tooltip: "An error occurred",
  },
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
          setLoading(true);
          const response = await fetch(`/api/domain/${domain}/verify`);
          const values: Response = (await response.json()) as Response;
          setStatus(values.status);
          setLoading(false);
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          setLoading(false);
        }
      }, 5000);

      return () => clearInterval(interval);
    }

    verifyCustomDomain();
  }, [domain]);

  if (loading) {
    return <OrangeLoadingSpinner />;
  }

  const config = statusConfig[status] || statusConfig["Unknown Error"];
  const IconComponent = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconComponent
            className={`h-5 w-5 ${config.fillClass} ${config.strokeClass}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
