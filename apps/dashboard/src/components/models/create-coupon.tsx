"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { trpc } from "@/src/app/_trpc/client";
import * as React from "react";
import { maketoast } from "../toasts";

interface CreateCouponProps {
  refetch: () => Promise<any>;
}

const CreateCoupon: FC<CreateCouponProps> = ({ refetch }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const mutation = trpc.createCoupon.useMutation({
    onSuccess: async () => {
      await refetch();
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  async function createCoupon() {
    await mutation.mutateAsync().then(() => {});
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button className=" rounded-xl border flex items-center gap-x-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.8575 3.61523V14.0404M14.0701 8.82784H3.6449"
              stroke="white"
              stroke-width="1.04252"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          انشاء القسيمة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl " title="انشاء قسيمة جديدة">
        <div className="w-full px-4 pb-6  ">
          <p>
            سيتمكن الطالب من مشاهدة الدورة اذا قام بادخال الرمز الخاص بهذه
            القسيمة{" "}
          </p>
          <p>وستكون في مكتبته الخاصة كانه اشتراها</p>
          <p>تنبيه يمكن استخدام هذه القسيمة لمرة واحدة فقط</p>
        </div>

        <DialogFooter className="w-full h-[50px] flex items-center justify-end gap-x-4 my-4">
          <Button onClick={() => setIsOpen(false)} variant="ghost">
            إلغاء
          </Button>
          <Button
            onClick={createCoupon}
            className=" flex items-center gap-x-2 "
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            انشاء القسيمة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCoupon;
