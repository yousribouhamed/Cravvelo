import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { DataTable } from "@/src/components/data-table";
import { columns, Course } from "@/src/components/data-table/columns/courses";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "database/src";
import { redirect } from "next/navigation";

async function getData(): Promise<Course[]> {
  const data = await prisma.course.findMany();
  return data.map((item) => ({
    id: item.id,
    price: item.price,
    profit: item.profit,
    studenstNbr: item.studenstNbr,
    title: item.title,
  }));
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
