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

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data: API_RESPONSE_TYPE = await req.json();

  console.log({ message: "this is what we got from the api" });
  console.log(data);

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

  return newCertificate;

  // save the data in the database
}
