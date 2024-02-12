"use client";

import type { FC } from "react";
import { useAcademiaStore } from "../../global-state/academia-store";

const PaymentForm: FC = ({}) => {
  const bagItems = useAcademiaStore();

  return (
    <div className="w-full min-h-[700px] h-fit grid gird grid-cols-2 my-[70px] p-8 gap-8">
      <div className="w-full h-full bg-gray-100 flex flex-col items-end p-8 rounded-xl">
        <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
          <button className="p-4 bg-white rounded-xl ">go back</button>
          <h2 className="text-xl font-bold text-black"> عربة التسوق</h2>
        </div>

        <div className="w-full min-h-[200px] h-fit  flex flex-col items-start p-2">
          {Array.isArray(bagItems.state.shoppingBag) &&
            bagItems.state.shoppingBag?.length === 0 && (
              <div className="w-full h-[400px] flex flex-col items-center justify-center">
                <h3 className="font-bold text-xl text-black">
                  حقيبة التسوق الخاصة بك فارغة
                </h3>
              </div>
            )}
          {Array.isArray(bagItems.state.shoppingBag) &&
            bagItems.state.shoppingBag?.length > 0 &&
            bagItems.state.shoppingBag?.map((product) => (
              <li key={product.id} className="flex py-4 gap-x-4">
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
                      <p className="ml-4">{product.price} DZD</p>

                      <button
                        type="button"
                        className="font-medium bg-blue-500 px-4 py-2 rounded-xl text-white"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </div>
        <div className="w-full h-[100px] flex flex-col items-start justify-center gap-y-4">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>المجموع الفرعي</p>
            <p>DZD 262.00</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p> الشحن والضرائب .</p>
            <p>DZD 0.00</p>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-8 flex flex-col  ">
        <button className="w-full h-[50px] rounded-xl bg-violet-500 text-white flex items-center justify-center">
          pay with chargily
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
