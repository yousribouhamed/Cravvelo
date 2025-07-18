"use client";

import { BookMarked } from "lucide-react";
import StarRatings from "react-star-ratings";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import { Product } from "database";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@ui/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";

interface Props {
  products: Product[];
  color: string;
}

const ProductsGrid: FC<Props> = ({ products, color }) => {
  const router = useRouter();

  const handleNavigate = ({ id }: { id: string }) => {
    router.push(`/product-academy/${id}`);
  };

  return (
    <div className="grid grid-cols-4 h-fit   gap-x-16">
      <div className=" col-span-4 p-4 pt-0  sm:col-span-4">
        <div className="flex flex-wrap   gap-8 w-full h-full mim-h-[500px] ">
          {Array.isArray(products) && products.length === 0 && (
            <div className="w-full h-[200px] flex items-center justify-center">
              <p className="text-xl font-bold">
                لا توجد المنتجات الرقمية حتى الآن في الأكاديمية
              </p>
            </div>
          )}

          {Array.isArray(products) &&
            products.map((item, index) => (
              <div
                key={item.title + index}
                className="w-[320px] min-h-[300px] h-fit p-0  border  flex flex-col shadow rounded-xl  transition-all duration-700 bg-white cursor-pointer "
              >
                <div className="h-[200px] w-full rounded-t-xl relative">
                  <Image
                    alt={item.title}
                    src={item.thumbnailUrl}
                    className="  object-cover rounded-t-xl"
                    fill
                  />
                </div>
                <div className="w-full h-[50px] flex items-center justify-between my-4 px-4">
                  <Link href={`/product-academy/${item.id}`}>
                    <h2 className="text-black font-semibold text-lg text-start  hover:underline  cursor-pointer">
                      {item.title}
                    </h2>
                  </Link>
                </div>
                {/* this will hold the stars */}
                <div className="w-full h-[10px] flex items-center justify-between my-4 px-4">
                  <div className="w-[50%] h-[20px] flex items-center justify-start gap-x-2">
                    <BookMarked className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500  text-sm text-start ">
                      {item.numberOfDownloads} عدد التحميلات
                    </span>
                  </div>
                </div>

                {/* this will hold the price */}

                {Number(item.price) === 0 ? (
                  <div className="w-full h-[10px] flex items-center justify-start gap-x-4 my-4 px-4">
                    <h2 className="text-blue-500 font-semibold text-sm text-start ">
                      الدورة مجانية
                    </h2>
                  </div>
                ) : (
                  <div className="w-full h-[10px] flex items-center justify-start gap-x-4 my-4 px-4">
                    <h2 className="text-black font-semibold text-lg text-start ">
                      DZD {item.price}
                    </h2>
                    <span className="  text-gray-500  line-through ">
                      DZD {item.compareAtPrice}
                    </span>
                  </div>
                )}

                <div className="w-full h-[70px] flex items-center justify-center gap-x-4 pt-2 p-4">
                  <button
                    onClick={() => handleNavigate({ id: item.id })}
                    className="w-[99%]  text-white p-2 h-[45px] rounded-lg"
                    style={{
                      background: color,
                    }}
                  >
                    اشتري الآن
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
