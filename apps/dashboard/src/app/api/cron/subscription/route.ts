// import { prisma } from "database/src";
import { NextResponse } from "next/server";

// export const maxDuration = 300; // This function can run for a maximum of 300 seconds
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export async function GET(request: Request) {
  // try {
  //   const [expiredSubscriptions, subscriptionsEndingSoon] = await Promise.all([
  //     prisma.payments.findMany({
  //       where: {
  //         end_of_subscription: {
  //           lt: new Date(),
  //         },
  //       },
  //     }),
  //     prisma.payments.findMany({
  //       where: {
  //         OR: [
  //           {
  //             strategy: "MONTHLY",
  //             end_of_subscription: {
  //               gt: new Date(), // gt stands for greater than
  //               lte: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // lte stands for less than or equal
  //             },
  //           },
  //           // For yearly subscriptions
  //           {
  //             strategy: "YEARLY",
  //             end_of_subscription: {
  //               gt: new Date(), // gt stands for greater than
  //               lte: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // lte stands for less than or equal
  //             },
  //           },
  //         ],
  //       },
  //     }),
  //   ]);
  //   await Promise.all(
  //     expiredSubscriptions.map((item) =>
  //       prisma.payments.update({
  //         where: {
  //           id: item.id,
  //         },
  //         data: {
  //           status: "EXPIRED",
  //         },
  //       })
  //     )
  //   );
  //   await Promise.all(
  //     expiredSubscriptions.map((item) =>
  //       prisma.account.update({
  //         where: {
  //           id: item.accountId,
  //         },
  //         data: {
  //           plan: null,
  //         },
  //       })
  //     )
  //   );
  //   return NextResponse.json({
  //     message: "Ok",
  //   });
  // } catch (err) {
  //   console.error(err);
  // }
  //TODO : send email to thoses who there subscription eded and who are close to an end

  return NextResponse.json({
    message: "Ok",
  });
}
