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
  components: ComponentBuilder[];
};

export type ComponentBuilder = {
  id: string;
  name: string;
  type: string;
  style: {
    backgroundColor: string;
    textColor: string;
    textSize: string;
    textThoughness: string;
    innerPosition: string;
  };
  content: {
    text: string;
    name: string;
  }[];
};
