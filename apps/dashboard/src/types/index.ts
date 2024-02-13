import { EditorBtns } from "../constants/website-template";

export type Module = {
  title: string;
  content: any;
  orderNumber: number;
  fileUrl: string;
  fileType: string;
};

export type WebSitePage = {
  pathname: string;
  title: string;
  elements: EditorElement[];
};

export type EditorElement = {
  image?: string;
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content:
    | EditorElement[]
    | { href?: string; innerText?: string; src?: string };
};

export type Editor = {
  pages: WebSitePage[];
  selectedElement: EditorElement;
  selectedPageIndex: number;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
  isSelectionMode: boolean;
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
  avatar: string;
  email: string;
  isFreeTrial: boolean;
  isSubscribed: boolean;
  subdomain: string;
  cutomDomain: string;
  createdAt: Date;
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
