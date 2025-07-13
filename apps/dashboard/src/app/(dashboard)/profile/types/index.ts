export interface ProfileFormProps {
  enhancedUserData: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    hasImage: boolean;
    primaryEmailAddress: {
      emailAddress: string;
      id: string;
    } | null;
    primaryPhoneNumber: {
      phoneNumber: string;
      id: string;
    } | null;
    username: string;
    createdAt: string;
    updatedAt: string;
    lastSignInAt: string | null;
    twoFactorEnabled: boolean;
    banned: boolean;
    locked: boolean;
    accountId: string;
    user_name: string;
    user_bio: string;
    support_email: string;
    phone: string;
    website: string;
    location: string;
    occupation: string;
    avatarUrl: string;
    fullName: string;
    initials: string;
  };
}