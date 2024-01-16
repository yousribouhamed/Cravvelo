"use client";

import * as z from "zod";
import type { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import Tiptap from "../tiptap";

const addTextSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.any(),
});

function AddTextForm() {
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
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    محتوى <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Tiptap
                      description={field.name}
                      onChnage={field.onChange}
                    />
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
          <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
            <Button type="submit" form="add-text" className="w-full" size="lg">
              {" "}
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

export default AddTextForm;
