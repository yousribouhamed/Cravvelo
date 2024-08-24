import { prisma } from "database/src";
import { NextRequest, NextResponse } from "next/server";

type API_RESPONSE_TYPE = {
  url: string;
  accountId: string;
  courseName: string;
  name: string;
  studentId: string;
  studentName: string;
};

export async function POST(req: NextRequest) {
  const data: API_RESPONSE_TYPE = await req.json();

  const newCertificate = await prisma.certificate.create({
    data: {
      accountId: data.accountId,
      courseName: data.courseName,
      name: data.name,
      studentId: data.studentId,
      studentName: data.studentName,
      fileUrl: data?.url,
    },
  });

  return NextResponse.json(newCertificate);
}
