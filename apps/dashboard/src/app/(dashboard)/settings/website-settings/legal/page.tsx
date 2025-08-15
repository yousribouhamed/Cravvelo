import AddPrivicyPolicy from "../../_compoents/forms/add-privacy-policy";
import { prisma } from "database/src";
import { getMyUserAction } from "@/src/actions/user.actions";

const Page = async ({}) => {
  const user = await getMyUserAction();

  const [website] = await Promise.all([
    prisma.website.findFirst({
      where: {
        accountId: user.accountId,
      },
    }),
  ]);

  return (
    <div className="w-full h-fit flex flex-col my-8 gap-y-4">
      <AddPrivicyPolicy policy={website?.privacy_policy} />
    </div>
  );
};

export default Page;
