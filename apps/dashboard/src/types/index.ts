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
    width: string;
    height: string;
    raduis: string;
    padding: string;
    alighment: string;
    direction: string;
    gap: string;
    marginTop: string;
    marginBottom: string;
    marginLeft: string;
    margineRight: string;
  };
  content: string;
  children: ComponentBuilder[];
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
