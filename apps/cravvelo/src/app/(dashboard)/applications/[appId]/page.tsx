import Header from "@/components/header";
import UpdateAppForm from "@/modules/apps/pages/update-app";

export default async function EditAppPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <div>
      <Header
        backTo="/applications"
        title="Update App"
        navigations={[
          {
            href: `/applications/${appId}`,
            label: "general",
          },
          {
            href: `/applications/${appId}/pricing`,
            label: "pricing",
          },
        ]}
      />
      <UpdateAppForm appId={appId} />
    </div>
  );
}
