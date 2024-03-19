"use client";

import { PropsWithChildren, useEffect } from "react";
import { maketoast } from "./toasts";

const ConnectionStatusAlert = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const handleOnline = () => {
      maketoast.successWithText({ text: "استعدنا الاتصال بالشبكة" });
    };

    const handleOffline = () => {
      maketoast.errorWithTest({ text: "فقدنا الاتصال بالشبكة" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <div className="w-full h-full">{children}</div>;
};

export default ConnectionStatusAlert;
