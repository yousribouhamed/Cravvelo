import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
} from "@/src/lib/domains";
import { DomainVerificationStatusProps } from "@/src/types/domain-types";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Await the params object in Next.js 15
  const resolvedParams = await params;

  const domain =
    process.env.NODE_ENV === "production"
      ? decodeURIComponent(resolvedParams.slug)
      : resolvedParams.slug;

  console.log(domain);
  let status: DomainVerificationStatusProps = "Valid Configuration";

  const [domainJson, configJson] = await Promise.all([
    getDomainResponse(domain),
    getConfigResponse(domain),
  ]);

  console.log(configJson);
  console.log(domainJson);

  if (domainJson?.error?.code === "not_found") {
    // domain not found on Vercel project
    status = "Domain Not Found";

    // unknown error
  } else if (domainJson.error) {
    status = "Unknown Error";

    // if domain is not verified, we try to verify now
  } else if (!domainJson.verified) {
    status = "Pending Verification";
    const verificationJson = await verifyDomain(domain);

    // domain was just verified
    if (verificationJson && verificationJson.verified) {
      status = "Valid Configuration";
    }
  } else if (configJson.misconfigured) {
    status = "Invalid Configuration";
  } else {
    status = "Valid Configuration";
  }

  return NextResponse.json({
    status,
    domainJson,
  });
}
