import {
  DomainResponse,
  DomainConfigResponse,
  DomainVerificationResponse,
} from "../types/domain-types";

// Helper function to build team query parameter
const getTeamQuery = () => {
  return process.env.TEAM_ID_VERCEL
    ? `?teamId=${process.env.TEAM_ID_VERCEL}`
    : "";
};

// Helper function to get common headers
const getHeaders = () => {
  if (!process.env.AUTH_BEARER_TOKEN) {
    throw new Error("AUTH_BEARER_TOKEN environment variable is required");
  }

  return {
    Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
    "Content-Type": "application/json",
  };
};

// Helper function to validate environment variables
const validateEnvVars = () => {
  if (!process.env.PROJECT_ID_VERCEL) {
    throw new Error("PROJECT_ID_VERCEL environment variable is required");
  }
  if (!process.env.AUTH_BEARER_TOKEN) {
    throw new Error("AUTH_BEARER_TOKEN environment variable is required");
  }
};

export const addDomainToVercel = async (domain: string) => {
  if (!domain || !validDomainRegex.test(domain)) {
    throw new Error("Invalid domain format");
  }

  validateEnvVars();

  try {
    const response = await fetch(
      `https://api.vercel.com/v10/projects/${
        process.env.PROJECT_ID_VERCEL
      }/domains${getTeamQuery()}`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: domain,
          // Optional: Redirect www. to root domain
          // ...(domain.startsWith("www.") && {
          //   redirect: domain.replace("www.", ""),
          // }),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to add domain: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ""
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding domain to Vercel:", error);
    throw error;
  }
};

export const removeDomainFromVercelProject = async (domain: string) => {
  if (!domain || !validDomainRegex.test(domain)) {
    throw new Error("Invalid domain format");
  }

  validateEnvVars();

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${
        process.env.PROJECT_ID_VERCEL
      }/domains/${domain}${getTeamQuery()}`,
      {
        headers: getHeaders(),
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to remove domain from project: ${response.status} ${
          response.statusText
        }. ${errorData.error?.message || ""}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing domain from Vercel project:", error);
    throw error;
  }
};

export const removeDomainFromVercelTeam = async (domain: string) => {
  if (!domain || !validDomainRegex.test(domain)) {
    throw new Error("Invalid domain format");
  }

  validateEnvVars();

  try {
    const response = await fetch(
      `https://api.vercel.com/v6/domains/${domain}${getTeamQuery()}`,
      {
        headers: getHeaders(),
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to remove domain from team: ${response.status} ${
          response.statusText
        }. ${errorData.error?.message || ""}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing domain from Vercel team:", error);
    throw error;
  }
};

export const getDomainResponse = async (
  domain: string
): Promise<DomainResponse & { error: { code: string; message: string } }> => {
  if (!domain || !validDomainRegex.test(domain)) {
    throw new Error("Invalid domain format");
  }

  validateEnvVars();

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${
        process.env.PROJECT_ID_VERCEL
      }/domains/${domain}${getTeamQuery()}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error getting domain response:", data);
      return {
        ...data,
        error: data.error || {
          code: response.status.toString(),
          message: response.statusText,
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error getting domain response:", error);
    throw error;
  }
};

export const getConfigResponse = async (
  domain: string
): Promise<DomainConfigResponse> => {
  if (!domain || !validDomainRegex.test(domain)) {
    throw new Error("Invalid domain format");
  }

  validateEnvVars();

  try {
    const response = await fetch(
      `https://api.vercel.com/v6/domains/${domain}/config${getTeamQuery()}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to get domain config: ${response.status} ${
          response.statusText
        }. ${errorData.error?.message || ""}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting config response:", error);
    throw error;
  }
};

export const verifyDomain = async (
  domain: string
): Promise<DomainVerificationResponse> => {
  if (!domain || !validDomainRegex.test(domain)) {
    throw new Error("Invalid domain format");
  }

  validateEnvVars();

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${
        process.env.PROJECT_ID_VERCEL
      }/domains/${domain}/verify${getTeamQuery()}`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to verify domain: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ""
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying domain:", error);
    throw error;
  }
};

export const getSubdomain = (name: string, apexName: string): string | null => {
  if (!name || !apexName || name === apexName) return null;

  // Ensure both names are valid
  if (!validDomainRegex.test(name) || !validDomainRegex.test(apexName)) {
    return null;
  }

  // Check if name actually ends with apexName
  if (!name.endsWith(`.${apexName}`)) {
    return null;
  }

  return name.slice(0, name.length - apexName.length - 1);
};

export const getApexDomain = (url: string): string => {
  if (!url || typeof url !== "string") {
    return "";
  }

  let domain;
  try {
    // Handle URLs without protocol
    const urlToProcess = url.startsWith("http") ? url : `https://${url}`;
    domain = new URL(urlToProcess).hostname;
  } catch (e) {
    // If URL parsing fails, try to extract domain directly if it looks like a domain
    if (validDomainRegex.test(url)) {
      domain = url;
    } else {
      return "";
    }
  }

  const parts = domain.split(".");
  if (parts.length > 2) {
    // For subdomains, return the last 2 parts (apex domain)
    return parts.slice(-2).join(".");
  }

  return domain;
};

// Courtesy of ChatGPT: https://sharegpt.com/c/pUYXtRs
// Enhanced regex with better validation
export const validDomainRegex = new RegExp(
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
);

// Additional utility function for testing domain functions
export const testDomainFunctions = async (
  testDomain: string = "example.com"
) => {
  console.log("Testing domain functions with:", testDomain);

  try {
    // Test domain validation
    console.log("Domain validation:", validDomainRegex.test(testDomain));

    // Test apex domain extraction
    console.log("Apex domain:", getApexDomain(testDomain));
    console.log(
      "Apex domain from URL:",
      getApexDomain(`https://www.${testDomain}`)
    );

    // Test subdomain extraction
    console.log("Subdomain:", getSubdomain(`www.${testDomain}`, testDomain));

    // Note: Actual API calls require valid environment variables
    console.log("API functions require valid environment variables to test");
  } catch (error) {
    console.error("Test error:", error);
  }
};
