import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Certificate } from "database";
import { prisma } from "database/src";
import CertificateTableShell from "./CertificatesTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData(): Promise<Certificate[]> {
  const data = await prisma.certificate.findMany();
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={[]} user={user} title="الشهادات" />
        <CertificateTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
