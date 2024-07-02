import { toast } from "@ui/lib/utils";
import { AlertTriangle, Book, Check, X } from "lucide-react";

export const maketoast = {
  success: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] min-h-[90px] h-fit rounded-2xl bg-white border shadow flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-green-500  flex items-center justify-center ">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start  items-start p-2">
            <span className="text-xl font-bold text-black ">نجاح</span>
            <span className="text-black text-lg text-start">
              كان الإجراء السابق ناجحا
            </span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-black "
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),

  successWithText: ({ text }: { text: string }) =>
    toast.custom(
      (t) => (
        <div className="w-[380px] min-h-[90px] h-fit rounded-2xl bg-white border shadow flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-green-500  flex items-center justify-center ">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">نجاح</span>
            <span className="text-black text-lg text-start">{text}</span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-black"
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
  error: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] min-h-[90px] h-fit rounded-2xl bg-white shadow  border flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#FF616D] flex items-center justify-center ">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">خطأ</span>
            <span className=" text-lg text-black">هناك خطأ ما</span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-black"
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
  errorWithTest: ({ text }: { text: string }) =>
    toast.custom(
      (t) => (
        <div className=" w-[380px] min-h-[90px] h-fit  rounded-2xl bg-white border shadow  flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#FF616D] flex items-center justify-center ">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] min-h-full h-fit flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">خطأ</span>
            <span className="text-black text-lg text-start">{text}</span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-black"
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),

  info: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] min-h-[90px] h-fit rounded-2xl bg-white border shadow  flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#006FFD] flex items-center justify-center ">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">معلومة</span>
            <span className="text-black text-lg text-start">
              تم تنفيذ الاجراء
            </span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-black"
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),

  warnning: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] min-h-[90px] h-fit rounded-2xl bg-white border shadow flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-yellow-500 flex items-center justify-center ">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">كن حذرا</span>
            <span className="text-black text-lg text-start">
              كن على علم بأن شيئًا ما قد حدث للتو
            </span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-black"
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
};
