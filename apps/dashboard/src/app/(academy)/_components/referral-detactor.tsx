"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, type FC } from "react";

const ReferralDetactor: FC = ({}) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      // todo save cookie in the browser
    }
  }, []);
  return null;
};

export default ReferralDetactor;
