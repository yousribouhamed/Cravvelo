"use server";

import { z } from "zod";
import { getStudent } from "./auth";
import { prisma } from "database/src";

const subscribeRequestValidator = z.object({
  ccp: z.string(),
  accountId: z.string(),
});

type Tsubscribe = z.infer<typeof subscribeRequestValidator>;

export const subscribe = async (payload: Tsubscribe) => {
  const data = subscribeRequestValidator.parse(payload);

  const student = await getStudent();

  const referral = await prisma.referral.create({
    data: {
      ccp: data.ccp,
      accountId: data.accountId,
      numberOfReferredStudents: 0,
      studentId: student.id,
      studentImage: student.photo_url,
      studentName: student.full_name,
    },
  });

  return referral;
};

const unSubscribeRequestValidator = z.object({
  id: z.string(),
});

type TunSubscribe = z.infer<typeof unSubscribeRequestValidator>;

export const unsubscribe = async ({ id }: TunSubscribe) => {
  const referral = await prisma.referral.delete({
    where: {
      id,
    },
  });

  return referral;
};
