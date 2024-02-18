import { NextRequest } from "next/server";
import { prisma } from "database/src";
import { StudentBag } from "@/src/types";
import { addCourseToStudentBag } from "@/src/app/(academy)/actions/coupon";

// const Get_client_api_secret_key = async () => {
//   const user = await useHaveAccess();

//   const payment = await prisma.paymentsConnect.findFirst({
//     where: {
//       accountId: user.accountId,
//     },
//   });

//   return payment;
// };
export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Event;

  // Switch based on the event type
  switch (payload.type) {
    case "checkout.paid":
      const studentId = payload.data.metadata[0]?.studentId;

      const productId = payload.data.metadata[0]?.productId;

      // get the student

      const student = await prisma.student.findFirst({
        where: {
          id: studentId,
        },
      });

      const studentbag = JSON.parse(student.bag as string) as StudentBag;

      const course = await prisma.course.findFirst({
        where: {
          id: productId,
        },
      });

      // const newStudentBag = {
      //   courses: [...studentbag.courses, course],
      // } as StudentBag;

      // update there bag

      await prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          bag: JSON.stringify(
            addCourseToStudentBag({
              bag: studentbag,
              course: course,
            })
          ),
        },
      });

      break;
    case "checkout.failed":
      break;
  }
}

type Metadata = {
  [key: string]: string;
};

type CheckoutData = {
  id: string;
  fees: number;
  amount: number;
  entity: string;
  locale: string;
  status: string;
  currency: string;
  livemode: boolean;
  metadata: Metadata[];
  created_at: number;
  invoice_id: null;
  updated_at: number;
  customer_id: string;
  description: null;
  failure_url: null;
  success_url: string;
  checkout_url: string;
  payment_method: null;
  payment_link_id: null;
  webhook_endpoint: null;
  pass_fees_to_customer: number;
};

type Event = {
  id: string;
  entity: string;
  type: string;
  data: CheckoutData;
  created_at: number;
  updated_at: number;
  livemode: boolean;
};
