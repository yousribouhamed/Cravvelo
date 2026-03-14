import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { prisma } from "database/src";
import { notFound } from "next/navigation";
import { getUserLocale } from "@/src/services/locale";
import { StudentDetailContent } from "@/src/modules/students/components/student-detail-content";

interface PageProps {
  params: Promise<{ student_id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { student_id } = await params;
  const user = await getMyUserAction();
  const locale = await getUserLocale();

  const [notifications, student] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    prisma.student.findUnique({
      where: {
        id: student_id,
        accountId: user.accountId,
      },
      include: {
        Sales: {
          include: {
            Course: {
              select: {
                id: true,
                title: true,
              },
            },
            Product: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        Certificates: {
          orderBy: { createdAt: "desc" },
        },
        Comments: {
          include: {
            Course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        Referrals: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        Payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        Invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    }),
  ]);

  if (!student) {
    notFound();
  }

  const serializedStudent = JSON.parse(
    JSON.stringify(student)
  ) as Parameters<typeof StudentDetailContent>[0]["student"];

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title={student.full_name}
        />
        <StudentDetailContent student={serializedStudent} locale={locale} />
      </main>
    </MaxWidthWrapper>
  );
}
