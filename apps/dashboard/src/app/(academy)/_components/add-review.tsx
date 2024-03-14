"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import StarRatings from "react-star-ratings";

export default function AddReview() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const cancelButtonRef = useRef(null);

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
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-center justify-between">
                      <div className="mt-3 w-full  flex items-center justify-between text-center sm:ml-4 sm:mt-0 sm:text-right">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          إضافة تقييم لهذه الدورة
                        </Dialog.Title>
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                          <X />
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[300px] flex flex-col items-end py-4 gap-y-4">
                      <div className="flex flex-col w-full gap-y-2">
                        <label>تقييمك</label>
                        <StarRatings
                          rating={rating}
                          starRatedColor="blue"
                          changeRating={(number) => setRating(number)}
                          numberOfStars={6}
                          name="rating"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-y-2">
                        <label>تعليقك</label>
                        <textarea className="h-[150px] w-full border rounded-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Deactivate
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
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
