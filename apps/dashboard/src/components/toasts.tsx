import { toast } from "@ui/lib/utils";
import { AlertTriangle, Book, Check, X } from "lucide-react";


export const maketoast = {
  success: () =>
    toast.custom(
      (t) => (
        <div className="w-[300px] min-h-[100px] h-fit rounded-xl bg-white border-l-4 border-l-green-500 border border-gray-200 shadow-lg flex items-center px-5 py-4">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start px-4">
            <span className="text-lg font-semibold text-gray-900">نجاح</span>
            <span className="text-gray-700 text-sm mt-1">
              كان الإجراء السابق ناجحا
            </span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
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
        <div className="w-[300px] min-h-[100px] h-fit rounded-xl bg-white border-l-4 border-l-green-500 border border-gray-200 shadow-lg flex items-center px-5 py-4">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start px-4">
            <span className="text-lg font-semibold text-gray-900">نجاح</span>
            <span className="text-gray-700 text-sm mt-1">{text}</span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
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
        <div className="w-[300px] min-h-[100px] h-fit rounded-xl bg-white border-l-4 border-l-red-500 border border-gray-200 shadow-lg flex items-center px-5 py-4">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start px-4">
            <span className="text-lg font-semibold text-gray-900">خطأ</span>
            <span className="text-gray-700 text-sm mt-1">هناك خطأ ما</span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
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
        <div className="w-[300px] min-h-[100px] h-fit rounded-xl bg-white border-l-4 border-l-red-500 border border-gray-200 shadow-lg flex items-center px-5 py-4">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start px-4">
            <span className="text-lg font-semibold text-gray-900">خطأ</span>
            <span className="text-gray-700 text-sm mt-1">{text}</span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
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
        <div className="w-[300px] min-h-[100px] h-fit rounded-xl bg-white border-l-4 border-l-blue-500 border border-gray-200 shadow-lg flex items-center px-5 py-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start px-4">
            <span className="text-lg font-semibold text-gray-900">معلومة</span>
            <span className="text-gray-700 text-sm mt-1">
              تم تنفيذ الاجراء
            </span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),

  warning: () =>
    toast.custom(
      (t) => (
        <div className="w-[300px] min-h-[100px] h-fit rounded-xl bg-white border-l-4 border-l-yellow-500 border border-gray-200 shadow-lg flex items-center px-5 py-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start px-4">
            <span className="text-lg font-semibold text-gray-900">كن حذرا</span>
            <span className="text-gray-700 text-sm mt-1">
              كن على علم بأن شيئًا ما قد حدث للتو
            </span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
};