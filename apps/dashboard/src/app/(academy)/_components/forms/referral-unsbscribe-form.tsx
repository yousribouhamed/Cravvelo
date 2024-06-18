"use client";

import React, { type FC } from "react";
import { Button } from "@ui/components/ui/button";
import { academiatoast } from "../academia-toasts";
import toast from "react-hot-toast";

interface ReferralFormProps {
  color: string;
  subdomain: string;
  referralId: string;
  referredPeople: number;
}

const ReferralUnSubscribtionForm: FC<ReferralFormProps> = ({
  referralId,
  color,
  subdomain,
  referredPeople,
}) => {
  return (
    <div className="w-full h-fit min-h-[300px] bg-white shadow border rounded-xl max-w-2xl p-8">
      <h1>احصل على الإيرادات المتكررة مدى الحياة!</h1>

      <div className="w-full h-[100px] flex justify-between items-center p-4">
        <span>عدد الأشخاص المشار إليهم</span>

        <span>{referredPeople}</span>
      </div>

      <div className="w-full flex flex-col gap-y-2 my-4 h-fit min-h-[50px] ">
        <p> رابط الإحالة الخاص بك 💁👌🎍😍</p>

        <div className="w-full h-[60px] flex items-center justify-between rounded-xl border gap-x-4 p-4">
          <Button
            style={{
              backgroundColor: color,
            }}
            onClick={() => {
              navigator.clipboard.writeText(`${subdomain}?ref=${referralId}`);

              toast.success("تم النسخ بنجاح", {
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            }}
          >
            نسخ
          </Button>
          <span className="text-sm text-gray-500">{`${subdomain}?ref=${referralId}`}</span>
        </div>
      </div>
    </div>
  );
};

export default ReferralUnSubscribtionForm;
