"use client";

import { useState } from "react";
import { useDomainStatus } from "../hooks/use-domain-status";
import { getSubdomain } from "@/src/lib/domains";
import {
  AlertCircle,
  XCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Info,
} from "lucide-react";
import { cn } from "@ui/lib/utils";

export const CodeBlock = ({
  className,
  children,
  copyable = false,
}: {
  className?: string;
  children: string;
  copyable?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="ltr" className="relative">
      <code
        className={cn(
          "inline-block rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200",
          className
        )}
      >
        {children}
      </code>
      {copyable && (
        <button
          onClick={copyToClipboard}
          className="ml-2 inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Copy to clipboard"
        >
          <Copy className="h-4 w-4" />
          {copied && (
            <span className="ml-1 text-xs text-green-600">Copied!</span>
          )}
        </button>
      )}
    </div>
  );
};

const StatusIndicator = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Valid Configuration":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
        };
      case "Pending Verification":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
        };
      default:
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={cn(
        "rounded-lg border p-4 mb-6",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-center space-x-3">
        {config.icon}
        <div>
          <h3 className={cn("font-semibold", config.color)}>{status}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {status === "Valid Configuration" &&
              "Your domain is properly configured!"}
            {status === "Pending Verification" &&
              "Please complete the verification steps below"}
            {status !== "Valid Configuration" &&
              status !== "Pending Verification" &&
              "There's an issue with your domain configuration"}
          </p>
        </div>
      </div>
    </div>
  );
};

const DNSRecord = ({
  type,
  name,
  value,
  ttl,
  description,
}: {
  type: string;
  name: string;
  value: string;
  ttl?: string;
  description?: string;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
            Type
          </label>
          <CodeBlock copyable>{type}</CodeBlock>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
            Name
          </label>
          <CodeBlock copyable>{name}</CodeBlock>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
            Value
          </label>
          <CodeBlock copyable className="break-all">
            {value}
          </CodeBlock>
        </div>

        {ttl && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
              TTL
            </label>
            <CodeBlock copyable>{ttl}</CodeBlock>
          </div>
        )}
      </div>
    </div>
  );
};

const HelpCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex items-start space-x-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function DomainConfiguration({ domain }: { domain: string }) {
  const [recordType, setRecordType] = useState<"A" | "CNAME">("A");
  const { status, domainJson } = useDomainStatus({ domain });

  // Don't show anything if domain is valid or we don't have data
  if (!status || status === "Valid Configuration" || !domainJson) return null;

  const subdomain = getSubdomain(domainJson.name, domainJson.apexName);
  const isSubdomain = !!subdomain;

  const txtVerification =
    (status === "Pending Verification" &&
      domainJson.verification.find((x: any) => x.type === "TXT")) ||
    null;

  return (
    <div className="space-y-6 p-6 border-t border-gray-200 dark:border-gray-700">
      <StatusIndicator status={status} />

      {txtVerification ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Step 1: Verify Domain Ownership
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add this TXT record to prove you own{" "}
              <CodeBlock>{domainJson.name}</CodeBlock>
            </p>
          </div>

          <DNSRecord
            type={txtVerification.type}
            name={txtVerification.domain.slice(
              0,
              txtVerification.domain.length - domainJson.apexName.length - 1
            )}
            value={txtVerification.value}
            description="Add this TXT record to your DNS provider"
          />

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Warning:</strong> Setting this TXT record will transfer
                domain ownership. If you're using this domain elsewhere, it may
                break that site.
              </div>
            </div>
          </div>
        </div>
      ) : status === "Unknown Error" ? (
        <div className="space-y-4">
          <h4 className="font-semibold text-red-600">Error Details</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
            {domainJson?.error.message}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Step 2: Configure DNS Records
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred DNS record type and add it to your DNS
              provider
            </p>
          </div>

          {/* Record Type Selector */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
            <button
              type="button"
              onClick={() => setRecordType("A")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                recordType === "A"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              A Record {!isSubdomain && "(Recommended)"}
            </button>
            <button
              type="button"
              onClick={() => setRecordType("CNAME")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                recordType === "CNAME"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              CNAME Record {isSubdomain && "(Recommended)"}
            </button>
          </div>

          <DNSRecord
            type={recordType}
            name={recordType === "A" ? "@" : subdomain ?? "www"}
            value={
              recordType === "A"
                ? "76.76.21.21"
                : `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
            }
            ttl="86400"
            description={`Configure your ${
              recordType === "A" ? "apex domain" : "subdomain"
            } (${recordType === "A" ? domainJson.apexName : domainJson.name})`}
          />

          <HelpCard>
            <div className="space-y-2">
              <p>
                <strong>TTL (Time To Live):</strong> Use 86400 seconds if
                available, otherwise use the highest value your DNS provider
                offers.
              </p>
              <p>
                <strong>Propagation:</strong> DNS changes can take up to 1 hour
                to take effect globally.
              </p>
              <p>
                <strong>Need help?</strong> Check your DNS provider's
                documentation for specific instructions on adding records.
              </p>
            </div>
          </HelpCard>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <ExternalLink className="h-4 w-4" />
            <span>
              Popular DNS providers: Cloudflare, Namecheap, GoDaddy, AWS Route
              53
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
