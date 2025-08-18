export type Course = {
  id: string;
  rating: number;
  accountId: string;
  title: string;
  courseUrl: string;
  youtubeUrl: string | null;
  thumbnailUrl: string | null;
  courseResume: string;
  courseRequirements: string;
  courseWhatYouWillLearn: string;
  courseDescription: string; // HTML string
  seoTitle: string;
  seoDescription: string;
  price: number;
  compareAtPrice: number | null;
  studentsNbr: number;
  preview_video: string | null;
  profit: number | null;
  length: number; // in minutes
  nbrChapters: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string; // extend if needed
  trainers: string[] | null; // could be IDs or objects depending on your schema
  suspended: boolean;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | string;
  sound: "ARABIC" | "ENGLISH" | "FRENCH" | string;
  allowComment: boolean;
  allowRating: boolean;
  forceWatchAllCourse: boolean;
  certificate: boolean;
  totalViews: number;
  totalEnrollments: number;
  createdAt: Date;
  updatedAt: Date;
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
