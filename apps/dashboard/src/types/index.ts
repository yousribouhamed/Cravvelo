import { Certificate, Course, Product as DataBaseProduct } from "database";
import { type FileWithPath } from "react-dropzone";
import { type z } from "zod";
import type { cartLineItemSchema } from "@/src/lib/validators/cart";

export type Module = {
  length: number;
  title: string;
  content: any;
  orderNumber: number;
  fileUrl: string;
  fileType: string;
};

export type WebsiteAssets = {
  name: string;
  fileUrl: string;
};

export type UserData = {
  userId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  user_name: string;
  avatar: string;
  email: string;
  isFreeTrial: boolean;
  isSubscribed: boolean;
  subdomain: string;
  customDomain: string;
  createdAt: Date;
  verified: boolean;
  verification_steps: number;
};

export interface Product {
  id: string;
  entity: string;
  livemode: boolean;
  name: string;
  description: string | null;
  images: string[];
  metadata: any[]; // Assuming metadata is an array of any type
  created_at: number;
  updated_at: number;
}

export interface Price {
  id: string;
  entity: string;
  livemode: boolean;
  amount: number;
  currency: string;
  metadata: any | null; // Depending on the actual type of metadata
  created_at: number;
  updated_at: number;
  product_id: string;
}

export interface Checkout {
  id: string;
  entity: string;
  livemode: boolean;
  amount: number;
  fees: number;
  pass_fees_to_customer: number;
  status: string;
  locale: string;
  description: string | null;
  metadata: any | null;
  success_url: string;
  failure_url: string | null;
  payment_method: string | null;
  invoice_id: string | null;
  customer_id: string;
  payment_link_id: string | null;
  created_at: number;
  updated_at: number;
  checkout_url: string;
}

export interface Student {
  firstName: string;
  lastName: string;
  email: string;
  phone_num: string;
  avatar: string;
}

export interface StudentBag {
  courses?: {
    course: Course;
    currentEpisode: number;
  }[];
  products?: DataBaseProduct[];
  certificates?: Certificate[];
}

export interface StoredFile {
  id: string;
  name: string;
  url: string;
}

export interface SubscriptionPlan {
  id: "basic" | "standard" | "pro";
  name: string;
  description: string;
  features: string[];
  stripePriceId: string;
  price: number;
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripeSubscriptionId?: string | null;
  stripeCurrentPeriodEnd?: string | null;
  stripeCustomerId?: string | null;
  isSubscribed: boolean;
  isCanceled: boolean;
  isActive: boolean;
}

export type CartLineItem = z.infer<typeof cartLineItemSchema>;

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}

export interface CourseWithEpisode {
  id: string;
  rating: number;
  accountId: string;
  title: string;
  courseUrl?: string | null;
  youtubeUrl?: string | null;
  thumbnailUrl?: string | null;
  courseResume?: string | null;
  courseRequirements?: string | null;
  courseWhatYouWillLearn?: string | null;
  courseDescription?: any; // Adjust the type if you have a specific structure
  seoTitle?: string | null;
  seoDescription?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  studentsNbr?: number | null;
  preview_video?: string | null;
  profit?: string | null;
  length: number;
  nbrChapters: number;
  status: string;
  trainers?: string | null;
  suspended: boolean;
  level: string;
  allowComment: boolean;
  allowRating: boolean;
  forceWatchAllCourse: boolean;
  certificate: boolean;
  createdAt: Date;
  updatedAt: Date;
  currentEpisode: number | null;
  owned: boolean;
}
