"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@ui/components/ui/button";
import { Skeleton } from "@ui/components/ui/skeleton";
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";

function LoadingForm() {
  return (
    <div className="w-full grid grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <div className="w-full my-8 flex flex-col gap-y-1">
          <Skeleton className="w-[100px] h-[30px]  rounded-xl" />
          <Skeleton className="w-full h-[50px]  rounded-xl" />
        </div>

        <div className="w-full my-8 flex flex-col gap-y-1">
          <Skeleton className="w-[100px] h-[30px]  rounded-xl" />
          <Skeleton className="w-full h-[120px]  rounded-xl" />
        </div>

        <div className="w-full my-8 flex flex-col gap-y-1">
          <Skeleton className="w-[100px] h-[30px]  rounded-xl" />
          <Skeleton className="w-full h-[120px]  rounded-xl" />
        </div>
      </div>
      <div className="col-span-1 w-full h-full ">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
            <Button
              type="submit"
              form="add-text"
              className="w-full flex items-center gap-x-2"
              size="lg"
            >
              حفظ والمتابعة
            </Button>
            <Button className="w-full" variant="secondary" size="lg">
              {" "}
              إلغاء والعودة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoadingForm;
