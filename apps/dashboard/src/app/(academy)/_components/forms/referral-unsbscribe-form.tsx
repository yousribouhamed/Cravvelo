"use client";

import React, { type FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@ui/components/ui/input";
import { LoadingButton } from "@/src/components/loading-button";
import { Student } from "database";
import { subscribe } from "../../_actions/referral";
import { academiatoast } from "../academia-toasts";
import { Button } from "@ui/components/ui/button";

interface ReferralFormProps {
  color: string;
  subdomain: string;
  referralId: string;
}

const ReferralUnSubscribtionForm: FC<ReferralFormProps> = ({
  referralId,
  color,
  subdomain,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div className="w-full h-fit min-h-[300px] bg-white shadow border rounded-xl max-w-2xl p-8">
      <h1>احصل على الإيرادات المتكررة مدى الحياة!</h1>

      <div className="w-full flex flex-col gap-y-2 my-4 h-fit min-h-[50px] bg-black">
        <p>رابط الإحالة الخاص بك</p>

        <div className="w-full h-[40px] flex items-center justify-between rounded-xl border">
          <span>{`${subdomain}/?ref=${referralId}`}</span>

          <Button
            style={{
              backgroundColor: color,
            }}
          >
            نسخ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralUnSubscribtionForm;
