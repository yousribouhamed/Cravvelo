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
};
