export type StudentProfile = {
  id: string;
  full_name: string;
  photo_url: string | null;
  bio: string | null;
  otp: string | null;
  email: string;
  phone: string | null;
  accountId: string;
  password: string; // hashed password
  bag: Record<string, any>; // empty object {} but can hold dynamic data
  emailVerified: boolean;
  emailVerifiedAt: string | null; // ISO date string
  emailVerificationToken: string | null;
  emailVerificationExpiry: string | null;
  passwordResetToken: string | null;
  passwordResetExpiry: string | null;
  lastVisitedAt: string | null; // ISO date string
  isActive: boolean;
  preferredLanguage: "ARABIC" | "ENGLISH" | "FRENCH" | string; // extend if needed
  timezone: string | null;
  emailNotifications: boolean;
  smsNotifications: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
