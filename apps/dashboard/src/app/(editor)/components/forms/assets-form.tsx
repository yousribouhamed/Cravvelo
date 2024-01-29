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

interface assetsFormAbdullahProps {}

const AssetsForm: FC = ({}) => {
  return (
    <Card className="w-full min-h-[400px]  h-fit  rounded-2xl col-span-2">
      <CardHeader>
        <CardTitle>الصور المستخدمة في الموقع</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AssetsForm;
