/**
 * Comprehensive list of restricted words for subdomain validation
 * This includes admin terms, common reserved words, and inappropriate content
 */

const restrictedWords = [
  // Admin and system terms
  "admin",
  "administrator",
  "root",
  "superuser",
  "moderator",
  "mod",
  "system",
  "sys",
  "api",
  "app",
  "application",
  "server",
  "host",
  "www",
  "mail",
  "email",
  "ftp",
  "ssh",
  "dns",
  "cdn",
  "static",
  "assets",
  "public",
  "private",
  "secure",
  "ssl",
  "tls",
  "cert",

  // Common reserved terms
  "about",
  "contact",
  "help",
  "support",
  "blog",
  "news",
  "legal",
  "terms",
  "privacy",
  "policy",
  "register",
  "login",
  "signin",
  "signup",
  "dashboard",
  "panel",
  "control",
  "config",
  "settings",
  "account",

  // Platform specific
  "cravvelo",
  "carvvelo",
  "test",
  "demo",
  "sandbox",
  "staging",
  "dev",
  "development",
  "prod",
  "production",
  "beta",
  "alpha",

  // Inappropriate content (add more as needed)
  "badword1",
  "badword2",
  "spam",
  "abuse",
  "hack",
  "exploit",

  // Single character and short combinations that might cause issues
  "a",
  "i",
  "o",
  "1",
  "11",
  "111",
  "aa",
  "aaa",

  // Protocol names
  "http",
  "https",
  "tcp",
  "udp",
  "ip",
  "dns",
  "smtp",
  "pop",
  "imap",
];

/**
 * Additional patterns that should be restricted
 */
const restrictedPatterns = [
  /^\d+$/, // Only numbers
  /^-/, // Starting with hyphen
  /-$/, // Ending with hyphen
  /--/, // Double hyphens
  /^(www\d*|mail\d*|ftp\d*|api\d*)$/i, // Common prefixes with optional numbers
];

/**
 * Checks if a subdomain contains restricted words
 * @param subdomain - The subdomain to check
 * @returns Object with validation result and message
 */
export const validateSubdomain = (
  subdomain: string
): {
  isValid: boolean;
  message?: string;
  suggestion?: string;
} => {
  if (!subdomain) {
    return { isValid: false, message: "Subdomain is required" };
  }

  const normalizedSubdomain = subdomain.toLowerCase().trim();

  // Check length
  if (normalizedSubdomain.length < 3) {
    return {
      isValid: false,
      message: "Subdomain must be at least 3 characters",
    };
  }

  if (normalizedSubdomain.length > 32) {
    return {
      isValid: false,
      message: "Subdomain must be at most 32 characters",
    };
  }

  // Check format
  if (!/^[a-zA-Z0-9-]+$/.test(normalizedSubdomain)) {
    return {
      isValid: false,
      message: "Subdomain can only contain letters, numbers, and hyphens",
    };
  }

  // Check restricted patterns
  for (const pattern of restrictedPatterns) {
    if (pattern.test(normalizedSubdomain)) {
      return {
        isValid: false,
        message: "This subdomain format is not allowed",
        suggestion: generateSuggestion(subdomain),
      };
    }
  }

  // Check restricted words
  if (restrictedWords.includes(normalizedSubdomain)) {
    return {
      isValid: false,
      message: "This subdomain is reserved and cannot be used",
      suggestion: generateSuggestion(subdomain),
    };
  }

  // Check if subdomain contains restricted words as substrings
  const containsRestrictedWord = restrictedWords.some((word) =>
    normalizedSubdomain.includes(word.toLowerCase())
  );

  if (containsRestrictedWord) {
    return {
      isValid: false,
      message: "Subdomain contains restricted content",
      suggestion: generateSuggestion(subdomain),
    };
  }

  return { isValid: true };
};

/**
 * Generates alternative suggestions for invalid subdomains
 * @param originalSubdomain - The original subdomain attempt
 * @returns A suggested alternative
 */
const generateSuggestion = (originalSubdomain: string): string => {
  const base = originalSubdomain.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suggestions = [
    `${base}app`,
    `${base}site`,
    `${base}hub`,
    `my${base}`,
    `${base}2024`,
    `${base}pro`,
  ];

  // Return the first suggestion that doesn't conflict with restricted words
  for (const suggestion of suggestions) {
    if (validateSubdomain(suggestion).isValid) {
      return suggestion;
    }
  }

  // Fallback: add random numbers
  return `${base}${Math.floor(Math.random() * 999) + 100}`;
};

/**
 * Checks if a subdomain is available (to be implemented with API call)
 * @param subdomain - The subdomain to check
 * @returns Promise indicating availability
 */
export const checkSubdomainAvailability = async (
  subdomain: string
): Promise<{
  isAvailable: boolean;
  message?: string;
}> => {
  // This would typically make an API call to check availability
  // For now, we'll simulate it
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate some taken subdomains
      const takenSubdomains = ["test", "demo", "sample", "example"];
      const isAvailable = !takenSubdomains.includes(subdomain.toLowerCase());

      resolve({
        isAvailable,
        message: isAvailable ? undefined : "This subdomain is already taken",
      });
    }, 500);
  });
};

/**
 * Sanitizes and formats a subdomain input
 * @param input - Raw input from user
 * @returns Cleaned subdomain string
 */
export const sanitizeSubdomain = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "") // Remove invalid characters
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single
    .substring(0, 32); // Ensure max length
};
