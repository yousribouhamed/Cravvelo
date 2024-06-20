import type { FC } from "react";
import { Dialog, DialogContent } from "@ui/components/ui/dialog";
import { openBlackKing } from "@/src/zustand/admin-state";
import { Button } from "@ui/components/ui/button";
import { Crown } from "lucide-react";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

interface blackKingProps {
  refetch: () => Promise<any>;
}

const BlackKing: FC<blackKingProps> = ({ refetch }) => {
  const { open, id, setIsOpen } = openBlackKing();

  const mutation = trpc.createBlackKing.useMutation({
    onSuccess: async () => {
      await refetch();
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(val) => setIsOpen(val)}>
      <DialogContent className="max-w-md" title="الملك الأسود">
        <div className="w-full  justify-start items-start p-4 pt-0 flex flex-col gap-y-2 ">
          <h2 className="text-xl font-bold text-black">خطة الملك الأسود</h2>
          <p className="text-lg  text-gray-700">
            إن إعطاء خطة الملك سيسمح للمستخدم بالاستفادة من جميع ميزات cravvelo
            دون أي قيود ودون الحاجة إلى تجديد الاشتراك
          </p>

          <div className="w-full h-[50px] flex items-center gap-x-2 justify-end">
            <Button
              disabled={mutation.isLoading}
              onClick={() => mutation.mutate({ id })}
              className="bg-black hover:bg-black text-white flex gap-x-2"
            >
              {mutation.isLoading ? (
                <LoadingSpinner />
              ) : (
                <Crown className="w-4 h-4 text-white" strokeWidth={3} />
              )}
              اصنع ملكا أسود
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlackKing;
