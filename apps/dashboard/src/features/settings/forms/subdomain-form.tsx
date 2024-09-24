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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { SUB_DOMAIN_AR, SUB_DOMAIN_EN } from "@cravvelo/i18n";

const restrictedWords = ["admin", "app", "badword1", "badword2"]; // Add more words as needed

const formSchema = z.object({
  subdomain: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(32, {
      message: "Username must be at most 32 characters.",
    })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Subdomain can only contain letters, numbers, and hyphens.",
    })
    .refine((val) => !restrictedWords.includes(val.toLowerCase()), {
      message: "Subdomain contains a restricted word.",
    }),
});

interface ChangeDomainFormProps {
  subdomain: string | null;
  lang: string;
}

const SubDomainForm: FC<ChangeDomainFormProps> = ({ subdomain, lang }) => {
  const SUB_DOMAIN = lang === "en" ? SUB_DOMAIN_EN : SUB_DOMAIN_AR;
  const initialSubdomain = subdomain ? subdomain.split(".")[0] : "";

  const mutation = trpc.chnageSubDmain.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subdomain: initialSubdomain,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      subdomain: data.subdomain + ".cravvelo.com",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-2xl ">
          <CardHeader>
            <CardTitle>{SUB_DOMAIN.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{SUB_DOMAIN.desc}</FormLabel>
                  <FormControl>
                    <div
                      className={`w-full h-14 border rounded-xl flex items-center p-2`}
                    >
                      {lang === "en" ? (
                        <>
                          <Input
                            className="border-none "
                            placeholder="myname.cravvelo.com"
                            {...field}
                          />
                          <div className="w-[150px] h-full flex items-center justify-center bg-primary text-white">
                            <span>carvvelo.com.</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-[150px] h-full flex items-center justify-center bg-primary text-white">
                            <span>carvvelo.com.</span>
                          </div>
                          <Input
                            className="border-none "
                            placeholder="myname.cravvelo.com"
                            {...field}
                          />
                        </>
                      )}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter
            className={`w-full h-[70px] flex items-center ${
              lang === "en" ? "justify-end" : "justify-start"
            } `}
          >
            <Button
              className=" flex items-center gap-x-2"
              disabled={!form.formState.isDirty || mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {lang === "en" ? "save" : "تاكيد"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SubDomainForm;
