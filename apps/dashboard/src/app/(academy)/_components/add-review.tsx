"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import StarRatings from "react-star-ratings";
import { Course } from "database";
import { create_rating } from "../_actions/rating";
import { maketoast } from "@/src/components/toasts";
import { revalidatePath } from "next/cache";

export default function AddReview({ course }: { course: Course }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  const cancelButtonRef = useRef(null);

  const submiteReview = async () => {
    try {
      setLoading(true);
      await create_rating({
        content,
        rating,
        course,
      });

      maketoast.successWithText({
        text: "لقد تم إرسال تعليقك للمراجعة، عند الموافقة عليه سيتم عرضه",
      });
    } catch (err) {
      maketoast.error();
      console.error(err);
    } finally {
      revalidatePath(`/course-academy/${course.id}`);
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>add review +</button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white p-4">
                    <div className="sm:flex sm:items-center justify-between">
                      <div className="mt-3 w-full  flex items-center justify-between text-center  sm:mt-0 sm:text-right">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          إضافة تقييم لهذه الدورة
                        </Dialog.Title>
                        <button
                          onClick={() => setOpen(false)}
                          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100 sm:mx-0 sm:h-10 sm:w-10 cursor-pointer"
                        >
                          <X />
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-[300px] flex flex-col items-end py-4 gap-y-4">
                      <div className="flex flex-col w-full h-[50px] items-start gap-y-2 ">
                        <label>تقييمك</label>
                        <StarRatings
                          rating={rating}
                          starRatedColor="#FC6B00"
                          starHoverColor="#FC6B00"
                          changeRating={(number) => setRating(number)}
                          numberOfStars={5}
                          starDimension="25px"
                          name="rating"
                        />
                      </div>
                      <div className="flex flex-col w-full items-start h-fit min-h-[50px]  gap-y-2">
                        <label>تعليقك</label>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="h-[150px] w-full rounded-lg border placeholder:text-[#8A8A8A] border-[#E6E6E6] bg-white dark:bg-white/10 dark:border-black px-3 py-2 text-sm    focus-visible:outline-none   focus:border-[#FC6B00]   transition-all duration-75  focus:border-2  disabled:cursor-not-allowed disabled:opacity-50 "
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50  py-3 sm:flex sm:flex-row-reverse  gap-x-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={() => submiteReview()}
                    >
                      {loading ? "loading.." : "اضافة التعليق"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      الغاء
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
