export type Course = {
  id: string;
  rating: number;
  accountId: string;
  title: string;
  courseUrl: string | null;
  youtubeUrl: string | null;
  thumbnailUrl: string | null;
  courseResume: string | null;
  courseRequirements: string | null;
  courseWhatYouWillLearn: string | null;
  courseDescription: any; // JSON type from Prisma (rich text editor content)
  seoTitle: string | null;
  seoDescription: string | null;
  price: number | null; // Keep for backward compatibility
  compareAtPrice: number | null; // Keep for backward compatibility
  studentsNbr: number | null;
  preview_video: string | null;
  profit: string | null;
  length: number; // in minutes
  nbrChapters: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;
  trainers: string | null;
  suspended: boolean;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | string | null;
  sound: "ARABIC" | "ENGLISH" | "FRENCH" | string | null;
  allowComment: boolean;
  allowRating: boolean;
  forceWatchAllCourse: boolean;
  certificate: boolean;
  totalViews: number;
  totalEnrollments: number;
  createdAt: Date;
  updatedAt: Date;
};

// Pricing Plan type
export type PricingPlan = {
  id: string;
  accountId: string;
  name: string;
  description: string | null;
  pricingType: "FREE" | "ONE_TIME" | "RECURRING";
  price: number | null;
  compareAtPrice: number | null;
  currency: string;
  accessDuration: "LIMITED" | "UNLIMITED" | null;
  accessDurationDays: number | null;
  recurringDays: number | null;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Course Pricing Plan junction type
export type CoursePricingPlan = {
  id: string;
  courseId: string;
  pricingPlanId: string;
  isDefault: boolean;
  createdAt: Date;
  PricingPlan: PricingPlan;
};

// Use your existing ModuleType and ChapterType
// (Remove the Chapter type since you already have ChapterType)

// Comment type (for completeness)
export type Comment = {
  id: string;
  content: string;
  rating: number;
  studentId: string;
  courseId: string;
  accountId: string;
  status: string;
  isApproved: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  Student?: {
    full_name: string;
    photo_url: string | null;
  };
};

// Extended Course type with all relations (what your server actions return)
export type CourseWithPricing = Course & {
  CoursePricingPlans: CoursePricingPlan[];
  Chapter?: ChapterType[]; // Use your existing ChapterType
  Comment?: Comment[];
  _count?: {
    Sale: number;
    Comment: number;
  };
};

export type CourseWithDefaultPricing = Course & {
  CoursePricingPlans: CoursePricingPlan[];
  _count?: {
    Sale: number;
  };
};

export type CourseListItem = Pick<
  Course,
  | "id"
  | "title"
  | "thumbnailUrl"
  | "rating"
  | "studentsNbr"
  | "level"
  | "length"
  | "status"
  | "totalViews"
  | "totalEnrollments"
> & {
  CoursePricingPlans: Pick<CoursePricingPlan, "isDefault" | "PricingPlan">[];
};

// For course creation/editing forms
export type CourseFormData = Omit<
  Course,
  "id" | "createdAt" | "updatedAt" | "totalViews" | "totalEnrollments"
> & {
  pricingPlans?: Omit<
    PricingPlan,
    "id" | "accountId" | "createdAt" | "updatedAt"
  >[];
};

// Utility type to get the default pricing plan for a course
export type DefaultPricingPlan = CoursePricingPlan & {
  isDefault: true;
};

export type ModuleType = {
  id: string;
  content: string; // stored as JSON string "{}"
  length: number;
  duration: number;
  fileType: "VIDEO" | "AUDIO" | "PDF" | "TEXT" | string; // expand if needed
  fileUrl: string;
  orderNumber: number;
  position: number;
  title: string;
  isPublished: boolean;
  isFree: boolean;
  type: "VIDEO" | "AUDIO" | "PDF" | "TEXT" | string; // matches fileType/type
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type ChapterType = {
  id: string;
  courseId: string;
  title: string;
  modules: ModuleType[]; // parsed array (not JSON string)
  orderNumber: number;
  isVisible: boolean;
  duration: number | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
