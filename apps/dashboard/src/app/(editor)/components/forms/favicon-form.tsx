"use client";

import { useState, type FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { ImageUploader } from "@/src/components/uploaders/ImageUploader";

const FaviconForm: FC = ({}) => {
  const [file, setFile] = useState<string>("");
  return (
    <Card className="w-full min-h-[200px] h-fit rounded-2xl col-span-1 p-0  ">
      <CardTitle className="text-xs m-2">الصور المستخدمة في الموقع</CardTitle>
      <CardContent className="p-0">
        <ImageUploader fileUrl={file} onChnage={setFile} />
      </CardContent>
    </Card>
  );
};

export default FaviconForm;
