import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { openBlackKing } from "@/src/zustand/admin-state";
import { Button } from "@ui/components/ui/button";
import { Crown } from "lucide-react";

interface blackKingProps {}

const BlackKing: FC = ({}) => {
  const { open, id, setIsOpen } = openBlackKing();

  return (
    <Dialog open={open} onOpenChange={(val) => setIsOpen(val)}>
      <DialogContent className="max-w-md" title="الملك الأسود">
        <div className="w-full  justify-start items-start p-4 pt-0 flex flex-col gap-y-2 ">
          <h2 className="text-xl font-bold text-black">خطة الملك الأسود</h2>
          <p className="text-lg  text-gray-700">
            إن إعطاء خطة الملك سيسمح للمستخدم بالاستفادة من جميع ميزات cravvelo
            دون أي قيود ودون الحاجة إلى تجديد الاشتراك
          </p>

          <div className="w-full h-[50px] flex items-center justify-end">
            <Button className="bg-black hover:bg-black text-white flex gap-x-2">
              <Crown className="w-4 h-4 text-white" strokeWidth={3} />
              اصنع ملكا أسود
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlackKing;
