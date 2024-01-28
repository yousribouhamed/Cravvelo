"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Input } from "@ui/components/ui/input";
import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

interface publishWebsiteAbdullahProps {}

const PublishWebsite: FC = ({}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    //do something in here
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" text-white font-bold rounded-2xl">حفظ ونشر</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg " title="إنشاء موقع الويب الخاص بك">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6 p-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>حدد اسم المجال الخاص بك</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="حدد مجالًا تم التحقق منه لعرضه" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@example.com">
                        m@example.com
                      </SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">
                        m@support.com
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    لا تقلق كثيرًا بشأن ذلك، يمكنك إضافة نطاقك المخصص لاحقًا
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="p-4">
          <Button type="submit" className="rounded-xl font-bold">
            إطلاق موقع الويب الخاص بي
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishWebsite;
