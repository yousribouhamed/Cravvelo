import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
} from "@/src/lib/domains";

import { DomainVerificationStatusProps } from "@/src/types/domain-types";
import { NextResponse } from "next/server";

const domainRegex =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const domain = decodeURIComponent(resolvedParams.slug)
      .trim()
      .toLowerCase();

    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        {
          status: "Unknown Error",
          domainJson: {
            name: domain,
            apexName: domain,
            verified: false,
            verification: [],
            error: {
              code: "invalid_domain",
              message: "Invalid domain format",
            },
          },
        },
        { status: 400 }
      );
    }

    let status: DomainVerificationStatusProps = "Valid Configuration";

    const [domainJson, configJson] = await Promise.all([
      getDomainResponse(domain),
      getConfigResponse(domain),
    ]);

    if (domainJson?.error?.code === "not_found") {
      status = "Domain Not Found";
    } else if (domainJson.error) {
      status = "Unknown Error";
    } else if (!domainJson.verified) {
      status = "Pending Verification";
      const verificationJson = await verifyDomain(domain);

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
  } catch (error) {
    console.error("Domain verification route failed:", error);
    return NextResponse.json(
      {
        status: "Unknown Error",
        domainJson: {
          name: "",
          apexName: "",
          verified: false,
          verification: [],
          error: {
            code: "verification_failed",
            message:
              "Unable to verify domain right now. Please try again in a moment.",
          },
        },
      },
      { status: 500 }
    );
  }
}
