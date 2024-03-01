"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBag, X } from "lucide-react";
import { useAcademiaStore } from "../../../global-state/academia-store";
import Link from "next/link";
import { useMounted } from "@/src/hooks/use-mounted";

export default function ShoppingCardProduction() {
  const [open, setOpen] = useState(false);

  const { state, actions } = useAcademiaStore();

  const isMounted = useMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-black w-[40px] h-450px] rounded-xl p-2 relative"
      >
        <ShoppingBag className="w-5 h-5 " />
        {state?.shoppingBag?.length > 0 && (
          <span className="rounded-[50%] w-5 h-5 text-white flex items-center justify-center bg-red-500 absolute top-0 right-0 font-bold text-xs">
            {state?.shoppingBag?.length}
          </span>
        )}
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
                    <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            عربة التسوق
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {Array.isArray(state?.shoppingBag) &&
                                state?.shoppingBag?.length === 0 && (
                                  <div className="w-full h-[400px] flex flex-col items-center justify-center">
                                    <h3 className="font-bold text-xl text-black">
                                      حقيبة التسوق الخاصة بك فارغة
                                    </h3>
                                  </div>
                                )}
                              {Array.isArray(state?.shoppingBag) &&
                                state?.shoppingBag?.length > 0 &&
                                state?.shoppingBag?.map((product) => (
                                  <li
                                    key={product.id}
                                    className="flex py-4 gap-x-4"
                                  >
                                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={product.imageUrl}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>{product.name}</h3>
                                        </div>
                                      </div>
                                      <div className="flex w-full flex-1 items-end justify-between text-sm">
                                        <div className="flex justify-between items-end w-full ">
                                          <p className="ml-4">
                                            DZD {product.price}.00
                                          </p>

                                          <button
                                            onClick={() =>
                                              actions.removeItem(product.id)
                                            }
                                            type="button"
                                            className="font-medium bg-primary hover:bg-orange-700 cursor-pointer px-4 py-2 rounded-xl text-white"
                                          >
                                            إزالة
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      {Array.isArray(state?.shoppingBag) &&
                        state?.shoppingBag?.length > 0 && (
                          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium my-4 text-gray-900">
                              <p>المجموع الفرعي</p>
                              <p>DZD {state?.shoppingBag[0]?.price}.00</p>
                            </div>

                            <div className="flex justify-between my-4 text-base font-medium text-gray-900">
                              <p> الشحن والضرائب </p>
                              <p>DZD 0.00</p>
                            </div>

                            <Link
                              href="/cart"
                              className=" mt-6 flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-700"
                            >
                              ادفع
                            </Link>

                            <div className="mt-6 flex justify-center text-center text-sm  text-gray-500">
                              <p>
                                أو{" "}
                                <button
                                  type="button"
                                  className="font-medium text-primary hover:text-orange-700 mx-2"
                                  onClick={() => setOpen(false)}
                                >
                                  مواصلة التسوق
                                </button>
                              </p>
                            </div>
                          </div>
                        )}
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
