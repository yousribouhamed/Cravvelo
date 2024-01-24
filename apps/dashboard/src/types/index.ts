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
  components: any[];
};
