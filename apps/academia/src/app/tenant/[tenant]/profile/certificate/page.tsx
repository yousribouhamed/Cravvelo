import { getStudentCertificates } from "@/modules/profile/actions/certificae.actions";
import { CertificateColumns } from "@/modules/profile/components/columns/certificate";
import { DataTable } from "@/modules/profile/components/data-table";

export default async function page() {
  const res = await getStudentCertificates();

  if (res.data) {
    return (
      <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border ">
        <h2 className="font-bold text-xl">الشهادات</h2>
        <DataTable
          columns={CertificateColumns}
          //@ts-expect-error
          data={res.data}
        />
      </div>
    );
  }

  return <div className="w-full h-[400px]"></div>;
}
