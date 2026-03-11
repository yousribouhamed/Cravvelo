import { prisma } from "database/src";
import AddLogoForm from "@/src/modules/settings/components/forms/add-logo-form";
import AddFavIconForm from "@/src/modules/settings/components/forms/add-favicon-form";
import UploadStampForm from "@/src/modules/settings/components/forms/upload-stamp-form";
import { getMyUserAction } from "@/src/actions/user.actions";

export default async function AssetsPage() {
  const user = await getMyUserAction();

  const website = await prisma.website.findFirst({
    where: { accountId: user.accountId },
  });

  return (
    <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-2 my-8 gap-4">
      <AddLogoForm logoUrl={website?.logo ?? undefined} />
      <AddFavIconForm logoUrl={website?.favicon ?? undefined} />
      <UploadStampForm stempUrl={website?.stamp ?? undefined} />
    </div>
  );
}
