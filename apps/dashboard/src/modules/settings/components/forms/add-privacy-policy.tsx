"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { CravveloEditor } from "@cravvelo/editor";

const formSchema = z.object({
  policy: z.any(),
});

interface AddPrivicyPolicyProps {
  policy: any;
}

const AddPrivicyPolicy: FC<AddPrivicyPolicyProps> = ({ policy }) => {
  // console.log("this is the polict: -< ");
  // console.log(policy);

  const mutation = trpc.addPolicy.useMutation({
    onSuccess: () => {
      console.log("Success!"); // Add this for debugging
      maketoast.success();
    },
    onError: (error) => {
      console.log("Error:", error); // More detailed error logging
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policy: policy ? JSON.parse(policy as string) : undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("this is the data we are sending in the polcy");
    console.log(data);
    await mutation.mutateAsync({
      policy: data.policy,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>سياسة الأكاديمية</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    اقرأ هذا القالب وانقر فوق &quot;حفظ&quot; لتنقذ نفسك
                    وعملائك.
                  </FormLabel>
                  <FormControl>
                    <CravveloEditor
                      value={form.getValues("policy")}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className=" flex items-center gap-x-2"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? <LoadingSpinner /> : null}
              تاكيد
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddPrivicyPolicy;
