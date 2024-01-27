import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface pageAbdullahProps {}

const page = async ({}) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الدورات التدريبية" />
        {/* <DataTable columns={columns} data={data} /> */}
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
