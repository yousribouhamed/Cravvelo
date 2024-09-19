"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import Ripples from "react-ripples";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { addCourseSchema } from "@/src/lib/validators/course";
import { trpc } from "@/src/app/_trpc/client";
import { getCookie } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { Icons } from "../my-icons";
import { PlusCircle } from "lucide-react";
import { maketoast } from "../toasts";

const icons = {
  icons1: () => (
    <svg
      width="39"
      height="33"
      viewBox="0 0 39 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2.01758"
        y="1.76819"
        width="34.0457"
        height="28.1681"
        fill="white"
      />
      <path
        d="M0.587891 27.612C0.587891 28.854 1.08127 30.0451 1.95949 30.9233C2.83771 31.8015 4.02883 32.2949 5.27082 32.2949H33.3684C34.6104 32.2949 35.8015 31.8015 36.6797 30.9233C37.5579 30.0451 38.0513 28.854 38.0513 27.612V4.97785C38.0513 3.73586 37.5579 2.54474 36.6797 1.66652C35.8015 0.7883 34.6104 0.294922 33.3684 0.294922H5.27082C4.02883 0.294922 2.83771 0.7883 1.95949 1.66652C1.08127 2.54474 0.587891 3.73586 0.587891 4.97785L0.587891 27.612ZM23.222 4.19736C23.2147 4.4746 23.1316 4.74455 22.9816 4.97785C22.8514 5.2141 22.6602 5.4111 22.4279 5.5483C22.1957 5.68549 21.9308 5.75786 21.6611 5.75786C21.3913 5.75786 21.1265 5.68549 20.8942 5.5483C20.6619 5.4111 20.4707 5.2141 20.3405 4.97785C20.1905 4.74455 20.1074 4.4746 20.1001 4.19736C20.1071 3.92008 20.1903 3.65007 20.3405 3.41687C20.4707 3.18062 20.6619 2.98362 20.8942 2.84643C21.1265 2.70923 21.3913 2.63686 21.6611 2.63686C21.9308 2.63686 22.1957 2.70923 22.4279 2.84643C22.6602 2.98362 22.8514 3.18062 22.9816 3.41687C23.1318 3.65007 23.215 3.92008 23.222 4.19736ZM28.6855 4.19736C28.6782 4.4746 28.595 4.74455 28.4451 4.97785C28.3148 5.2141 28.1236 5.4111 27.8913 5.5483C27.6591 5.68549 27.3942 5.75786 27.1245 5.75786C26.8547 5.75786 26.5899 5.68549 26.3576 5.5483C26.1253 5.4111 25.9341 5.2141 25.8039 4.97785C25.6539 4.74455 25.5708 4.4746 25.5635 4.19736C25.5706 3.92008 25.6537 3.65007 25.8039 3.41687C25.9341 3.18062 26.1253 2.98362 26.3576 2.84643C26.5899 2.70923 26.8547 2.63686 27.1245 2.63686C27.3942 2.63686 27.6591 2.70923 27.8913 2.84643C28.1236 2.98362 28.3148 3.18062 28.4451 3.41687C28.5952 3.65007 28.6784 3.92008 28.6855 4.19736ZM34.1489 4.19736C34.1416 4.4746 34.0584 4.74455 33.9085 4.97785C33.7783 5.2141 33.587 5.4111 33.3548 5.5483C33.1225 5.68549 32.8577 5.75786 32.5879 5.75786C32.3181 5.75786 32.0533 5.68549 31.821 5.5483C31.5887 5.4111 31.3975 5.2141 31.2673 4.97785C31.1173 4.74455 31.0342 4.4746 31.0269 4.19736C31.034 3.92008 31.1171 3.65007 31.2673 3.41687C31.3996 3.18235 31.5913 2.98676 31.8231 2.84976C32.0549 2.71277 32.3186 2.63917 32.5879 2.63638C32.8878 2.63775 33.181 2.72548 33.4323 2.88908C33.6837 3.05269 33.8826 3.28524 34.0053 3.55892C34.0983 3.759 34.1473 3.97672 34.1489 4.19736ZM3.70984 8.48848C3.70984 8.38498 3.75096 8.28572 3.82414 8.21254C3.89733 8.13935 3.99659 8.09824 4.10009 8.09824H34.5391C34.6426 8.09824 34.7419 8.13935 34.8151 8.21254C34.8882 8.28572 34.9294 8.38498 34.9294 8.48848V27.6104C34.9294 28.0244 34.7649 28.4215 34.4722 28.7142C34.1794 29.007 33.7824 29.1714 33.3684 29.1714H5.27082C4.85682 29.1714 4.45978 29.007 4.16704 28.7142C3.8743 28.4215 3.70984 28.0244 3.70984 27.6104V8.48848Z"
        fill="#FC6B00"
      />
      <path
        d="M11.1909 23.2524C11.4836 23.545 11.8806 23.7094 12.2945 23.7094C12.7084 23.7094 13.1054 23.545 13.3981 23.2524L17.3006 19.35C17.5932 19.0572 17.7576 18.6603 17.7576 18.2464C17.7576 17.8324 17.5932 17.4355 17.3006 17.1427L13.3981 13.2403C13.1037 12.956 12.7094 12.7986 12.3001 12.8022C11.8909 12.8057 11.4994 12.9699 11.2099 13.2593C10.9205 13.5487 10.7564 13.9403 10.7528 14.3495C10.7492 14.7588 10.9066 15.1531 11.1909 15.4475L13.7135 17.9701C13.7498 18.0063 13.7786 18.0494 13.7983 18.0968C13.818 18.1442 13.8281 18.195 13.8281 18.2464C13.8281 18.2977 13.818 18.3485 13.7983 18.3959C13.7786 18.4433 13.7498 18.4864 13.7135 18.5227L11.1909 21.0452C10.8983 21.3379 10.7339 21.7349 10.7339 22.1488C10.7339 22.5627 10.8983 22.9597 11.1909 23.2524Z"
        fill="#FC6B00"
      />
      <path
        d="M20.8808 23.7098H27.1247C27.5387 23.7098 27.9357 23.5454 28.2285 23.2526C28.5212 22.9599 28.6857 22.5629 28.6857 22.1489C28.6857 21.7349 28.5212 21.3378 28.2285 21.0451C27.9357 20.7523 27.5387 20.5879 27.1247 20.5879H20.8808C20.4668 20.5879 20.0698 20.7523 19.777 21.0451C19.4843 21.3378 19.3198 21.7349 19.3198 22.1489C19.3198 22.5629 19.4843 22.9599 19.777 23.2526C20.0698 23.5454 20.4668 23.7098 20.8808 23.7098Z"
        fill="#FC6B00"
      />
    </svg>
  ),
  icon2: () => (
    <svg
      width="39"
      height="33"
      viewBox="0 0 39 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2.01758"
        y="1.57898"
        width="34.0457"
        height="28.1681"
        fill="white"
      />
      <rect
        x="7.18555"
        y="10.0359"
        width="23.7094"
        height="5.66188"
        rx="0.680278"
        fill="#FC6B00"
      />
      <rect
        x="7.18555"
        y="18.469"
        width="10.8407"
        height="7.31969"
        rx="0.680278"
        fill="#FC6B00"
      />
      <rect
        x="20.0547"
        y="18.469"
        width="10.8407"
        height="2.30835"
        rx="0.680278"
        fill="#FC6B00"
      />
      <rect
        x="20.0547"
        y="23.4807"
        width="10.8407"
        height="2.30835"
        rx="0.680278"
        fill="#FC6B00"
      />
      <path
        d="M0.588867 27.4228C0.588867 28.6648 1.08225 29.8559 1.96046 30.7341C2.83868 31.6123 4.0298 32.1057 5.27179 32.1057H33.3694C34.6113 32.1057 35.8025 31.6123 36.6807 30.7341C37.5589 29.8559 38.0523 28.6648 38.0523 27.4228V4.78864C38.0523 3.54665 37.5589 2.35553 36.6807 1.47731C35.8025 0.599091 34.6113 0.105713 33.3694 0.105713H5.27179C4.0298 0.105713 2.83868 0.599091 1.96046 1.47731C1.08225 2.35553 0.588867 3.54665 0.588867 4.78864L0.588867 27.4228ZM23.223 4.00815C23.2157 4.2854 23.1326 4.55534 22.9826 4.78864C22.8524 5.0249 22.6612 5.22189 22.4289 5.35909C22.1966 5.49628 21.9318 5.56865 21.662 5.56865C21.3923 5.56865 21.1274 5.49628 20.8952 5.35909C20.6629 5.22189 20.4717 5.0249 20.3415 4.78864C20.1915 4.55534 20.1084 4.2854 20.1011 4.00815C20.1081 3.73087 20.1913 3.46086 20.3415 3.22766C20.4717 2.99141 20.6629 2.79441 20.8952 2.65722C21.1274 2.52002 21.3923 2.44765 21.662 2.44765C21.9318 2.44765 22.1966 2.52002 22.4289 2.65722C22.6612 2.79441 22.8524 2.99141 22.9826 3.22766C23.1328 3.46086 23.216 3.73087 23.223 4.00815ZM28.6864 4.00815C28.6791 4.2854 28.596 4.55534 28.446 4.78864C28.3158 5.0249 28.1246 5.22189 27.8923 5.35909C27.66 5.49628 27.3952 5.56865 27.1255 5.56865C26.8557 5.56865 26.5909 5.49628 26.3586 5.35909C26.1263 5.22189 25.9351 5.0249 25.8049 4.78864C25.6549 4.55534 25.5718 4.2854 25.5645 4.00815C25.5715 3.73087 25.6547 3.46086 25.8049 3.22766C25.9351 2.99141 26.1263 2.79441 26.3586 2.65722C26.5909 2.52002 26.8557 2.44765 27.1255 2.44765C27.3952 2.44765 27.66 2.52002 27.8923 2.65722C28.1246 2.79441 28.3158 2.99141 28.446 3.22766C28.5962 3.46086 28.6794 3.73087 28.6864 4.00815ZM34.1498 4.00815C34.1426 4.2854 34.0594 4.55534 33.9095 4.78864C33.7792 5.0249 33.588 5.22189 33.3557 5.35909C33.1235 5.49628 32.8586 5.56865 32.5889 5.56865C32.3191 5.56865 32.0543 5.49628 31.822 5.35909C31.5897 5.22189 31.3985 5.0249 31.2683 4.78864C31.1183 4.55534 31.0352 4.2854 31.0279 4.00815C31.0349 3.73087 31.1181 3.46086 31.2683 3.22766C31.4006 2.99314 31.5922 2.79756 31.824 2.66056C32.0558 2.52356 32.3196 2.44997 32.5889 2.44718C32.8888 2.44854 33.1819 2.53627 33.4333 2.69987C33.6847 2.86348 33.8836 3.09603 34.0062 3.36971C34.0993 3.56979 34.1482 3.78751 34.1498 4.00815ZM3.71082 8.29927C3.71082 8.19578 3.75193 8.09651 3.82512 8.02333C3.8983 7.95014 3.99756 7.90903 4.10106 7.90903H34.5401C34.6436 7.90903 34.7428 7.95014 34.816 8.02333C34.8892 8.09651 34.9303 8.19578 34.9303 8.29927V27.4212C34.9303 27.8352 34.7659 28.2323 34.4731 28.525C34.1804 28.8177 33.7834 28.9822 33.3694 28.9822H5.27179C4.8578 28.9822 4.46076 28.8177 4.16802 28.525C3.87528 28.2323 3.71082 27.8352 3.71082 27.4212V8.29927Z"
        fill="#FC6B00"
      />
    </svg>
  ),
};

interface AddNewProps {
  lang: string;
}

const AddNew: FC<AddNewProps> = ({ lang }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLaoding, setIsLoading] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<0 | 1>(0);
  const mutation = trpc.createCourse.useMutation({
    onSuccess: ({ courseId }) => {
      router.push(`/courses/${courseId}/chapters`);
      maketoast.successWithText({ text: "تم انشاء الدورة بنجاح" });
      setIsOpen(false);
    },
    onError: () => {
      maketoast.error();
      setIsOpen(false);
    },
  });

  const productMutation = trpc.createProduct.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/products/${id}/content`);
      maketoast.successWithText({ text: "تم انشاء المنتج بنجاح" });
      setIsOpen(false);
    },
    onError: () => {
      maketoast.error();
      setIsOpen(false);
    },
  });

  const form = useForm<z.infer<typeof addCourseSchema>>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof addCourseSchema>) {
    const cookie = getCookie("accountId");
    setIsLoading(true);
    if (selectedItem === 0) {
      await mutation
        .mutateAsync({
          title: data.title,
          accountId: cookie,
        })
        .then(() => {
          setIsLoading(false);
        });
    }
    if (selectedItem === 1) {
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <button
          data-ripple-light="true"
          className="rounded-xl w-full h-12 px-6   text-primary bg-white  hover:scale-105 transition-all duration-150 font-bold flex gap-x-4 justify-start items-center"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 49 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.2962 34.9965C6.77536 28.2564 7.76372 18.3169 14.5038 12.7961C21.2439 7.27514 31.1833 8.26356 36.7042 15.0036C42.2251 21.7438 41.2368 31.6831 34.4966 37.204C27.7566 42.7249 17.8171 41.7366 12.2962 34.9965Z"
              fill="#FC6B00"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24.501 16.4453C25.4023 16.4453 26.1329 17.1759 26.1329 18.0772L26.1329 31.9247C26.1329 32.826 25.4023 33.5567 24.501 33.5567C23.5997 33.5567 22.869 32.826 22.869 31.9247L22.869 18.0772C22.869 17.1759 23.5997 16.4453 24.501 16.4453Z"
              fill="#F8FAE5"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M33.0567 25.001C33.0567 25.9023 32.326 26.6329 31.4247 26.6329H17.5772C16.6759 26.6329 15.9453 25.9023 15.9453 25.001C15.9453 24.0997 16.6759 23.369 17.5772 23.369H31.4247C32.326 23.369 33.0567 24.0997 33.0567 25.001Z"
              fill="#F8FAE5"
            />
          </svg>

          <span className="qatar-bold ">
            {lang === "en" ? "Add new" : "إضافة جديد"}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" title="إضافة دورة جديدة">
        <div className="w-full px-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedItem === 0 ? " عنوان الدورة " : "عنوان المنتج"}*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل عنوان الدورة الجديدة، مثال: دورة تصميم تجربة المستخدم"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full h-[70px] flex items-center justify-center gap-x-10">
                <Ripples color="#fc69005c" during={1200}>
                  <Button
                    type="button"
                    onClick={() => setSelectedItem(0)}
                    variant="secondary"
                    size="lg"
                    className={`bg-white flex items-center gap-x-4 text-lg font-bold border text-black h-16 ${
                      selectedItem === 0 ? "border-[#FC6B00] border-2" : ""
                    }`}
                  >
                    <div className="w-fit h-fit shadow-md bg-transparent border-none shadow-primary flex items-center justify-center">
                      <icons.icons1 />
                    </div>
                    دورة تدريبية
                  </Button>
                </Ripples>

                <Ripples color="#fc69005c" during={1200}>
                  <Button
                    type="button"
                    onClick={() => setSelectedItem(1)}
                    variant="secondary"
                    disabled
                    size="lg"
                    className={`bg-white text-lg font-bold border flex items-center gap-x-4 text-black h-16 ${
                      selectedItem === 1 ? "border-[#FC6B00] border-2" : ""
                    }`}
                  >
                    <div className="w-fit h-fit shadow-md bg-transparent border-none shadow-primary flex items-center justify-center">
                      <icons.icon2 />
                    </div>
                    منتج رقمي
                  </Button>
                </Ripples>
              </div>
              <DialogFooter className="w-full h-[50px] flex items-center  justify-center gap-x-4">
                <Button
                  data-ripple-light="true"
                  size="lg"
                  type="submit"
                  className="rounded-xl flex items-center justify-center gap-x-2"
                >
                  {isLaoding && <LoadingSpinner />}
                  اضافة جديد
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNew;
