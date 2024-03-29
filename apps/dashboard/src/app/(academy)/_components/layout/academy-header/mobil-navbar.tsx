"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlignJustify } from "lucide-react";
import { useMounted } from "@/src/hooks/use-mounted";
import { Home } from "lucide-react";
import { School } from "lucide-react";

export default function MobilNavgiationProduction() {
  const [open, setOpen] = useState(false);

  const isMounted = useMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-black w-[40px] h-450px] rounded-xl p-2"
      >
        <AlignJustify className="w-6 h-6 " />
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
                    <div className="flex h-full flex-col overflow-y-auto gap-y-4 p-4 bg-white shadow-xl">
                      <button className=" w-full h-[45px] flex items-center justify-start gap-x-4">
                        <Home strokeWidth={3} className=" w-6 h-6 " />
                        الصفحة الرئيسية
                      </button>
                      <button className=" w-full h-[45px] flex items-center justify-start gap-x-4">
                        <School strokeWidth={3} className=" w-6 h-6 " />
                        الدورات التدريبية
                      </button>
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
