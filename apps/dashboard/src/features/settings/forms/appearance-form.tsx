"use client";

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
} from "@ui/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { trpc } from "@/src/app/_trpc/client";
import { setLangCookie } from "@cravvelo/i18n";

const formSchema = z.object({
  lang: z.string(),
});

function AppearanceForm({ lang }: { lang: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lang,
    },
  });

  const mutation = trpc.setAccountLang.useMutation({
    onSuccess: () => {
      setLangCookie(form.getValues("lang"));

      window.location.reload();
    },
    onError: () => {
      // set a better error display
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutation.mutateAsync({
        lang: values.lang,
      });
    } catch (err) {}
  }

  return (
    <div className="w-full h-fit rounded-2xl shadow border space-y-2 p-4 bg-white ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
          <FormField
            control={form.control}
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>language</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="english" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">arabic</SelectItem>
                      <SelectItem value="en">english</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="w-full h-[70px] flex items-center justify-end">
        <Button
          size="sm"
          variant="form"
          disabled={!form.formState.isDirty}
          type="submit"
          className=""
        >
          save
        </Button>
      </div>
    </div>
  );
}

export default AppearanceForm;
