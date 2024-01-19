"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";
import * as React from "react";

const addTextSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.any(),
});

const selectionButtoms = [
  {
    title: "مسودة",
    description: "سيتم عرضها لفريقك فقط",
    value: "DRAFT",
  },
  {
    title: "ينشر",
    description: "سيكون مرئيًا للجميع",
    value: "PUBLISED",
  },
  {
    title: "الوصول المبكر",
    description: "شراء مبكر في الأكاديمية الخاصة بك",
    value: "EARLY_ACCESS",
  },
  {
    title: "خاص",
    description: "لا يمكن الوصول إليه إلا من خلال عنوان url",
    value: "PRIVATE",
  },
];

function PublishCourseForm() {
  const [selectedItem, setSelectedItem] = React.useState<
    "DRAFT" | "PUBLISED" | "EARLY_ACCESS" | "PRIVATE"
  >("PUBLISED");
  const form = useForm<z.infer<typeof addTextSchema>>({
    mode: "onChange",
    resolver: zodResolver(addTextSchema),
    defaultValues: {
      title: "",
      content: JSON.stringify(""),
    },
  });

  function onSubmit(values: z.infer<typeof addTextSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full grid grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    عنوان النص <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="col-span-1 w-full h-full ">
        <Card>
          <CardContent className="w-full bg-[#F2F4F4]  h-fit flex flex-col  space-y-2">
            {selectionButtoms.map((item) => (
              <Button
                key={item.value}
                type="button"
                //@ts-expect-error
                onClick={() => setSelectedItem(item.value)}
                variant="secondary"
                size="lg"
                className={`bg-white flex items-center gap-x-4 text-lg border text-black h-12 ${
                  selectedItem === item.value ? "border-[#43766C] border-2" : ""
                }`}
              >
                دورة تدريبية
              </Button>
            ))}

            <div>
              <Button
                type="submit"
                form="add-text"
                className="w-full"
                size="lg"
              >
                {" "}
                حفظ والمتابعة
              </Button>
              <Button className="w-full" variant="secondary" size="lg">
                {" "}
                إلغاء والعودة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PublishCourseForm;
