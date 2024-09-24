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
  FormMessage,
} from "@ui/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { trpc } from "@/src/app/_trpc/client";
import { setLangCookie, LANGUAGE_AR, LANGUAGE_EN } from "@cravvelo/i18n";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

const formSchema = z.object({
  lang: z.string(),
});

function AppearanceForm({ lang }: { lang: string }) {
  const LANGUAGE = lang === "en" ? LANGUAGE_EN : LANGUAGE_AR;
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
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="w-full h-fit rounded-2xl shadow border space-y-2 p-4 bg-white ">
      <Form {...form}>
        <form
          id="lang-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 "
        >
          <FormField
            control={form.control}
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{LANGUAGE.title}</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={`w-full h-[70px] flex items-center ${
              lang === "en" ? "justify-end" : "justify-start"
            } `}
          >
            <Button
              size="sm"
              variant="form"
              disabled={!form.formState.isDirty || mutation.isLoading}
              type="submit"
              className=""
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {lang === "en" ? "save" : "تاكيد"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AppearanceForm;
