"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import {
  OrangeLoadingSpinner,
} from "@ui/icons/loading-spinner";
import { useDomainStatus } from "../hooks/use-domain-status";
import { DomainVerificationStatusProps } from "../types/domain-types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";

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

interface DomainStatusProps {
  domain: string;
  status?: DomainVerificationStatusProps;
  loading?: boolean;
  disablePolling?: boolean;
}

export default function DomainStatus({
  domain,
  status: providedStatus,
  loading: providedLoading,
  disablePolling = false,
}: DomainStatusProps) {
  const hookData = useDomainStatus({ domain: disablePolling ? "" : domain });
  const status = providedStatus ?? hookData.status;
  const loading = providedLoading ?? hookData.loading;

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
