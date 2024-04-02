"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBag, X } from "lucide-react";
import { useAcademiaStore } from "../../../global-state/academia-store";
import { useMounted } from "@/src/hooks/use-mounted";
import AcademyPyments from "../../forms/academy-pyments";

export default function ShoppingCardProduction({
  subdomain,
  color,
}: {
  subdomain: string | null;
  color: string;
}) {
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
                    <div className="flex h-full flex-col overflow-y-auto bg-[#E3E8EF] shadow-xl">
                      <div className="flex-1 overflow-y-auto my-4 px-4 py-3 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-2xl font-bold text-[#677489]">
                            سلة التسوق
                          </Dialog.Title>
                          <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-black cursor-pointer flex items-center justify-center p-4"
                          >
                            <X className="w-4 h-4 " />
                          </button>
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
                                    className="flex p-4 gap-x-4 border bg-white border-[#C4B8B8] rounded-xl"
                                  >
                                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden  rounded-xl   ">
                                      <img
                                        src={product.imageUrl}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3 className="font-bold text-xl text-black">
                                            {product.name}
                                          </h3>
                                        </div>
                                      </div>
                                      <div className="flex w-full flex-1 items-end justify-between text-sm">
                                        <div className="flex justify-between items-end w-full ">
                                          <div
                                            style={{
                                              background: color ?? "#FC6B00",
                                            }}
                                            className=" px-4 py-3  rounded-full flex items-center justify-center "
                                          >
                                            <p className=" text-white font-bold">
                                              {product.price} DZD
                                            </p>
                                          </div>

                                          <button
                                            onClick={() =>
                                              actions.removeItem(product.id)
                                            }
                                            type="button"
                                            className=" border  border-primary text-primary  hover:bg-orange-700 cursor-pointer px-4 py-3 font-bold rounded-full hover:text-white flex items-center justify-center gap-1"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M14.75 2.75H12.0807C11.7575 2.75 11.4718 2.54451 11.369 2.23776L11.132 1.52521C10.9273 0.912458 10.355 0.5 9.70924 0.5H6.28998C5.64348 0.5 5.07125 0.912531 4.86725 1.52603L4.63026 2.23703C4.52826 2.54378 4.24174 2.75 3.91849 2.75H1.25C0.836 2.75 0.5 3.08525 0.5 3.5C0.5 3.91475 0.836 4.25 1.25 4.25H2.04875L2.61198 12.6995C2.71623 14.27 4.03101 15.5 5.60526 15.5H10.3955C11.9697 15.5 13.2845 14.2692 13.3887 12.6995L13.952 4.25H14.75C15.164 4.25 15.5 3.91475 15.5 3.5C15.5 3.08525 15.164 2.75 14.75 2.75ZM6.29076 2L9.71002 1.99927L9.94701 2.71173C9.95151 2.72523 9.95824 2.7365 9.96349 2.75H6.03798C6.04248 2.7365 6.05 2.7245 6.0545 2.711L6.29076 2ZM11.8918 12.5998C11.8393 13.385 11.1822 14 10.3947 14H5.60452C4.81777 14 4.16 13.385 4.1075 12.5998L3.55173 4.25H3.91927C3.99952 4.25 4.07823 4.23948 4.15698 4.23123C4.18923 4.23573 4.21698 4.25 4.25073 4.25H11.7507C11.7837 4.25 11.8122 4.23498 11.8445 4.23123C11.9232 4.23948 12.0012 4.25 12.0822 4.25H12.4497L11.8918 12.5998ZM10.25 7.25V11C10.25 11.4147 9.914 11.75 9.5 11.75C9.086 11.75 8.75 11.4147 8.75 11V7.25C8.75 6.83525 9.086 6.5 9.5 6.5C9.914 6.5 10.25 6.83525 10.25 7.25ZM7.25 7.25V11C7.25 11.4147 6.914 11.75 6.5 11.75C6.086 11.75 5.75 11.4147 5.75 11V7.25C5.75 6.83525 6.086 6.5 6.5 6.5C6.914 6.5 7.25 6.83525 7.25 7.25Z"
                                                fill="#FC6B00"
                                              />
                                            </svg>
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
                      {state.shoppingBag.length > 0 && (
                        <AcademyPyments
                          setOpen={setOpen}
                          subdomain={subdomain}
                          color={color}
                        />
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
