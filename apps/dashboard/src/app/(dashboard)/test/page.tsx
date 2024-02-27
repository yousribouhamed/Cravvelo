"use client";

import { PDFUploader } from "@/src/components/uploaders/PDFUploader";
import type { FC } from "react";
import React from "react";

interface PageProps {}

const Page: FC = ({}) => {
  const [url, setUrl] = React.useState<string>("");
  return (
    <div className="w-full h-screen p-12 bg-gray-100">
      <PDFUploader fileUrl={url} onChnage={setUrl} />
    </div>
  );
};

export default Page;
