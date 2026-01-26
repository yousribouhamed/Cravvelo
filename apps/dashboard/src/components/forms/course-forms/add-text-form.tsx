"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { CravveloEditor } from "@cravvelo/editor";
import { maketoast } from "../../toasts";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { useTranslations } from "next-intl";

function AddTextForm() {
  const t = useTranslations("courseForms");
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);

  const addTextSchema = z.object({
    title: z.string({ required_error: t("requiredField") }).min(2).max(50),
    content: z.string().min(1, t("contentRequired")),
    duration: z.number().optional().default(0),
  });

  const mutation = trpc.createTextModule.useMutation({
    onSuccess: (data) => {
      maketoast.success(t("lessonCreated"));
      router.back();
    },
    onError: (error) => {
      maketoast.error(t("lessonCreateFailed"));
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof addTextSchema>>({
    mode: "onChange",
    resolver: zodResolver(addTextSchema),
    defaultValues: {
      title: "",
      content: "",
      duration: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof addTextSchema>) {
    try {
      await mutation.mutateAsync({
        chapterID: chapterID,
        content: values.content,
        fileType: "DOCUMENT",
        title: values.title,
        duration: values.duration,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div className="w-full grid grid-cols-3 gap-x-8">
      <div className="col-span-2 w-full h-full">
        <Form {...(form as any)}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("textTitle")} <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("textTitlePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("readingDuration")}
                    <span className="text-sm text-muted-foreground dark:text-gray-400 mr-2">
                      {t("readingDurationOptional")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="5"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("lessonContent")} <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <CravveloEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <div className="col-span-1 w-full h-full">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6 space-y-4">
            <Button
              disabled={mutation.isLoading}
              type="submit"
              form="add-text"
              className="w-full flex items-center gap-x-2"
              size="lg"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {t("saveAndContinue")}
            </Button>
            <Button
              onClick={() => router.back()}
              className="w-full"
              variant="secondary"
              size="lg"
            >
              {t("cancelAndGoBack")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddTextForm;
