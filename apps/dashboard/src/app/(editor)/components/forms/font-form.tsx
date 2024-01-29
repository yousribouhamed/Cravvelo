"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";

interface FontFormProps {}

const FontForm: FC = ({}) => {
  return (
    <Card className="w-full min-h-[200px] h-fit rounded-2xl col-span-2">
      <CardTitle className="text-xs m-2">الصور المستخدمة في الموقع</CardTitle>
    </Card>
  );
};

export default FontForm;
