import Link from "next/link";
import type { FC } from "react";

interface ConfirmeAccountProps {}

const steps = [
  {
    name: "",
  },
];

const ConfirmeAccount: FC = ({}) => {
  return (
    <div className="w-full h-[300px] mt-8 bg-white rounded-xl shadow border  flex items-center ">
      <div className="w-[50%] h-full flex flex-col items-start justify-start p-4">
        <h2 className="text-xl font-bold"> بعض الأشياء للإعداد!</h2>

        <div className="w-full h-[50px] flex flex-col items-start p-2 my-4">
          <Link href={"/"}>
            <p className="text-lg  text-green-500 hover:underline">
              قم بانهاء ملفك الشخصي
            </p>
          </Link>
          <p>حتى نتمكن من توثيق اكاديميتك ويتمكن طلبك من الاتصال بك</p>
        </div>
        <div className="w-full h-[50px] flex flex-col items-start p-2 my-4 ">
          <Link href={"/"}>
            <p className="text-lg  text-green-500 hover:underline">
              قم برفع اول دورة لك
            </p>
          </Link>
          <p>حتى نتمكن من توثيق اكاديميتك ويتمكن طلبك من الاتصال بك</p>
        </div>
        <div className="w-full h-[50px] flex flex-col items-start p-2 my-4 ">
          <Link href={"/"}>
            <p className="text-lg  text-green-500 hover:underline">
              ادخل وسيلة الدفع
            </p>
          </Link>
          <p>حتى نتمكن من توثيق اكاديميتك ويتمكن طلبك من الاتصال بك</p>
        </div>
      </div>
      <div className="w-[50%] h-full bg-blue-500"></div>
    </div>
  );
};

export default ConfirmeAccount;
