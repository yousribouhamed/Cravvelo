import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { DataTable } from "@/src/components/data-table";
import { Payment, columns } from "@/src/components/data-table/columns/courses";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

interface pageAbdullahProps {}

const page = async ({}) => {
  const data = await getData();

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  console.log(user);
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الدورات التدريبية" />
        <DataTable columns={columns} data={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
