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
interface LogoFormAbdullahProps {}

const LogoForm: FC = ({}) => {
  const [file, setFile] = useState<string>("");

  //

  return (
    <Card className="w-full min-h-[200px] h-fit rounded-2xl  p-0  col-span-2">
      <CardTitle className="text-xs my-2">الصور المستخدمة في الموقع</CardTitle>
      <CardContent className="p-0">
        <ImageUploader fileUrl={file} onChnage={setFile} />
      </CardContent>
    </Card>
  );
};

export default LogoForm;
