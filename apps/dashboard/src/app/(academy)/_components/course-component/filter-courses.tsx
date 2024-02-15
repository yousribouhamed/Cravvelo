"use client";

import { Filter } from "lucide-react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import StarRatings from "react-star-ratings";

export default function FilterCourses() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white rounded-xl border p-4"
      >
        <Filter className="w-4 h-4" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[99]" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="w-full max-w-[400px]  h-full  border bg-white  flex flex-col justify-center items-center sticky top-[70px]">
                      <div className="w-full min-h-[200px] h-fit flex flex-col  border-b p-4">
                        <p>raiting</p>
                        <div className="w-full flex flex-col h-fit gap-y-4 my-4">
                          {/* 5 starts */}
                          <div className="w-full h-[20px] flex items-center justify-between ">
                            <button className="w-7 h-7 border rounded-xl bg-white"></button>
                            <StarRatings
                              rating={5}
                              starDimension="20px"
                              starSpacing="1px"
                            />
                          </div>
                          {/* 4 starts */}
                          <div className="w-full h-[20px] flex items-center justify-between">
                            <button className="w-7 h-7 border rounded-xl bg-white"></button>
                            <StarRatings
                              rating={4}
                              starDimension="20px"
                              starSpacing="1px"
                            />
                          </div>
                          {/* 3 starts */}
                          <div className="w-full h-[20px] flex items-center justify-between">
                            <button className="w-7 h-7 border rounded-xl bg-white"></button>
                            <StarRatings
                              rating={3}
                              starDimension="20px"
                              starSpacing="1px"
                            />
                          </div>
                          {/* 2 stars */}
                          <div className="w-full h-[20px] flex items-center justify-between">
                            <button className="w-7 h-7 border rounded-xl bg-white"></button>
                            <StarRatings
                              rating={2}
                              starDimension="20px"
                              starSpacing="1px"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-[300px] flex flex-col  border-b p-4">
                        <p>course duration</p>
                      </div>
                      <div className="w-full h-[300px] flex flex-col  border-b p-4">
                        <p>raiting</p>
                      </div>
                      <div className="w-full h-[300px] flex flex-col  border-b p-4">
                        <p>pricing</p>
                      </div>

                      <div className="w-full h-[300px] flex flex-col  border-b p-4">
                        <p>level</p>
                      </div>
                      <div className="w-full h-[300px] flex justify-center items-center  ">
                        <button className="px-4 py-2 rounded-xl bg-blue-500 text-white">
                          apply filters
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
