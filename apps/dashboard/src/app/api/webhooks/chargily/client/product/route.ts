import { NextRequest } from "next/server";
import { prisma } from "database/src";
import { StudentBag } from "@/src/types";
// import { create_product_sale } from "@/src/app/(academy)/_actions/sales";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Event;

  switch (payload.type) {
    case "checkout.paid":
      const studentId = payload.data.metadata[0]?.studentId;
      const productId = payload.data.metadata[0]?.productId;
      if (!studentId || !productId) return;

      const student = await prisma.student.findFirst({
        where: {
          id: studentId,
        },
      });

      if (!student) return;

      const defaultBag: StudentBag = { courses: [], products: [], certificates: [] };
      const studentbag: StudentBag = (() => {
        const bag = (student as any)?.bag as unknown;
        if (!bag) return defaultBag;
        if (typeof bag === "string") {
          try {
            const parsed = JSON.parse(bag);
            return parsed && typeof parsed === "object"
              ? (parsed as StudentBag)
              : defaultBag;
          } catch {
            return defaultBag;
          }
        }
        return typeof bag === "object" ? (bag as StudentBag) : defaultBag;
      })();

      const product = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });
      if (!product) return;

      // Check if the course already exists in the student's bag.
      const theCourseExists =
        studentbag?.products &&
        studentbag?.products?.find((item) => item.id === product.id);

      // If the course already exists, return the current bag without modification.
      if (theCourseExists) {
        return;
      }

      // If the course doesn't exist, create a new student bag with the added course.
      const oldData =
        studentbag.products && studentbag.products.length > 0
          ? [...studentbag.products]
          : [];

      const newStudentBag = {
        ...studentbag,
        products: [...oldData, JSON.parse(JSON.stringify(product))],
      } as StudentBag;

      await prisma.student.update({
        where: {
          id: student.id,
        },
        data: {
          bag: JSON.parse(JSON.stringify(newStudentBag)),
        },
      });
      // await create_product_sale({
      //   accountId: product.accountId,
      //   product,
      //   studentId: student.id,
      // });

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
