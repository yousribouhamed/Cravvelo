import UpdateAppForm from "@/modules/apps/pages/update-app";

export default async function EditAppPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <div>
      <UpdateAppForm appId={appId} />
    </div>
  );
}
