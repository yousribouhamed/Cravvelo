import { NextRequest, NextResponse } from "next/server";
import { prisma } from "database/src";
import { StudentBag } from "@/src/types";
// import { addCourseToStudentBag } from "@/src/app/(academy)/_actions/coupon";
// import { create_course_sale } from "@/src/app/(academy)/_actions/sales";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Event;

    switch (payload.type) {
      case "checkout.paid": {
        const studentId = payload.data.metadata[0]?.studentId;
        const productId = payload.data.metadata[0]?.productId;
        if (!studentId || !productId) {
          return NextResponse.json(
            { error: "Missing studentId or productId in metadata" },
            { status: 400 }
          );
        }

        const student = await prisma.student.findFirst({
          where: {
            id: studentId,
          },
        });

        if (!student) {
          return NextResponse.json({ received: true, ignored: "student_not_found" });
        }

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

        const course = await prisma.course.findFirst({
          where: {
            id: productId,
          },
        });
        if (!course) {
          return NextResponse.json({ received: true, ignored: "course_not_found" });
        }

        const theCourseExists =
          studentbag?.courses &&
          studentbag?.courses?.find((item) => item.course.id === course.id);

        // If the course already exists, acknowledge the webhook and stop.
        if (theCourseExists) {
          return NextResponse.json({ received: true, ignored: "already_exists" });
        }

        const oldData =
          studentbag.courses && studentbag.courses.length > 0
            ? [...studentbag.courses]
            : [];
        const newStudentBag = {
          courses: [
            ...oldData,
            {
              course: JSON.parse(JSON.stringify(course)),
              currentEpisode: 0,
            },
          ],
        } as StudentBag;

        await prisma.student.update({
          where: {
            id: student.id,
          },
          data: {
            bag: JSON.parse(JSON.stringify(newStudentBag)),
          },
        });
        break;
      }
      case "checkout.failed":
        break;
      default:
        console.log("⚠️ Unknown event type:", payload.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Chargily client webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
