"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, type FC } from "react";
import Cookies from "js-cookie";

const ReferralDetactor: FC = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      Cookies.set("referral_code", ref, { expires: 7 }); // Expires in 7 days
    }
  }, [searchParams]);

  return null;
};

export default ReferralDetactor;
