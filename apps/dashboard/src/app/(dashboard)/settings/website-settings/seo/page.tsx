import { prisma } from "database/src";
import AddSeoForm from "@/src/modules/settings/components/forms/add-seo-form";
import { getMyUserAction } from "@/src/actions/user.actions";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";

const Page = async () => {
  const user = await getMyUserAction();

  if (!user?.subdomain) {
    return <CreateAcademiaSection />;
  }

  const website = await prisma.website.findFirst({
    where: { accountId: user.accountId },
  });

  // Display only the site title (e.g. "twice"), not a prefixed value like "home-twice"
  const displayTitle =
    website?.name != null
      ? website.name.replace(/^home-/i, "").trim() || website.name
      : null;

  return (
    <div className="w-full h-fit my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AddSeoForm
          description={website?.description ?? null}
          title={displayTitle}
        />
      </div>
    </div>
  );
};

export default Page;
