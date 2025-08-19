import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { prisma } from "database/src";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ student_id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { student_id } = await params;
  const user = await getMyUserAction();

  const [notifications, student] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    prisma.student.findUnique({
      where: {
        id: student_id,
      },
    }),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title={student?.full_name}
        />
        <div className="w-full min-h-[400px]  mt-4 h-fit flex flex-col items-center justify-start border shadow rounded-xl bg-white p-4">
          <div className="w-full h-[50px] flex items-center justify-start my-2 p-4 px-0 ">
            <h2 className="text-xl font-bold text-black">المعلومات الشخصية</h2>
          </div>
          <div className="w-full h-[300px]  flex items-center justify-start gap-x-4">
            <div className="w-[300px] h-full relative rounded-xl border ">
              <Image
                src={student?.photo_url ?? "/avatar.png"}
                alt={student?.full_name + "photo"}
                fill
                className="rounded-xl"
              />
            </div>

            <div className="w-[500px] h-full flex flex-col ">
              <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
                <p className="font-bold">اسم : </p>
                <p>{student?.full_name}</p>
              </div>
              <div className="w-full h-[50px] flex items-center justify-start  gap-x-4">
                <p className="font-bold">بريد إلكتروني : </p>
                <p>{student?.email}</p>
              </div>
              <div className="w-full h-[50px] flex items-center justify-start  gap-x-4 ">
                <p className="font-bold">هاتف : </p>
                <p>{student?.phone}</p>
              </div>
              <div className="w-full h-[50px] flex flex-col items-start justify-center gap-y-2  gap-x-4">
                <p className="font-bold">السيرة الذاتية : </p>
                <p>{student?.bio}</p>
              </div>
            </div>
          </div>

          {/* courses */}

          <div className="w-full h-[50px] flex items-center justify-start p-4 my-2 px-0 ">
            <h2 className="text-xl font-bold text-black"> الدورات التدريبية</h2>
          </div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
