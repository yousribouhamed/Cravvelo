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

interface ReferralFormProps {
  studnet: Student;
  accountId: string;
  color: string;
}

const ReferralSubscribtionForm: FC<ReferralFormProps> = ({
  studnet,
  color,
  accountId,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div className="w-full h-fit min-h-[300px] bg-white shadow border rounded-xl max-w-2xl p-8">
      <div className="w-full my-4 h-[50px] bg-black"></div>
    </div>
  );
};

export default ReferralSubscribtionForm;
