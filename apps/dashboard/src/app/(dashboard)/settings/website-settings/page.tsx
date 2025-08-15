import { getMyUserAction } from "@/src/actions/user.actions";
import { DomainSettignsPage } from "@/src/modules/settings/pages/domain.page";

const Page = async ({}) => {
  const user = await getMyUserAction();

  return (
    <DomainSettignsPage
      customDomain={user.customDomain}
      subdomain={user.subdomain}
    />
  );
};

export default Page;
