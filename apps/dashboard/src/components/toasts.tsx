import { toast } from "@ui/lib/utils";
import { AlertTriangle, Bone, Book, Check, Info, X } from "lucide-react";

export const maketoast = {
  success: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] h-[90px] rounded-2xl bg-white flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#3AC0A0] flex items-center justify-center ">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">نجاح</span>
            <span className="text-gray-500 text-xl text-start">
              كان الإجراء السابق ناجحا
            </span>
          </div>
          <X onClick={() => toast.dismiss(t)} className="cursor-pointer" />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
  error: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] h-[90px] rounded-2xl bg-white  flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#FF616D] flex items-center justify-center ">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">نجاح</span>
            <span className="text-gray-500 text-xl text-start">
              كان الإجراء السابق ناجحا
            </span>
          </div>
          <X onClick={() => toast.dismiss(t)} className="cursor-pointer" />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
  errorWithTest: ({ text }: { text: string }) =>
    toast.custom(
      (t) => (
        <div className="w-[380px] h-[90px] rounded-2xl bg-white  flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#FF616D] flex items-center justify-center ">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">نجاح</span>
            <span className="text-gray-500 text-xl text-start">{text}</span>
          </div>
          <X onClick={() => toast.dismiss(t)} className="cursor-pointer" />
        </div>
      ),
      {
        position: "top-left",
      }
    ),

  info: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] h-[90px] rounded-2xl bg-white flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#006FFD] flex items-center justify-center ">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">نجاح</span>
            <span className="text-gray-500 text-xl text-start">
              كان الإجراء السابق ناجحا
            </span>
          </div>
          <X onClick={() => toast.dismiss(t)} className="cursor-pointer" />
        </div>
      ),
      {
        position: "top-left",
      }
    ),

  warnning: () =>
    toast.custom(
      (t) => (
        <div className="w-[380px] h-[90px] rounded-2xl bg-white flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-[#FFB37C] flex items-center justify-center ">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="w-[80%] flex flex-col justify-start items-start p-2">
            <span className="text-xl font-bold text-black ">نجاح</span>
            <span className="text-gray-500 text-xl text-start">
              كان الإجراء السابق ناجحا
            </span>
          </div>
          <X onClick={() => toast.dismiss(t)} className="cursor-pointer" />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
};
