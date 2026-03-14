"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { ImageUploaderS3 } from "../../uploaders/image-uploader";
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Textarea } from "@ui/components/ui/textarea";
import { CravveloEditor } from "@cravvelo/editor";
import { Product } from "database";
import { maketoast } from "../../toasts";
import { PdfUploaderS3 } from "../../uploaders/pdf-uploader";
import { useTranslations } from "next-intl";

const addProductConentNameSchema = z.object({
  name: z.string().min(1).max(50),
  breifDescription: z.any(),
  description: z.any(),
  fileUrl: z.string(),
  imageUrl: z.string(),
});

interface ProductContentFormProps {
  product: Product;
}

function ProductContentForm({ product }: ProductContentFormProps) {
  const t = useTranslations("productForms.contentForm");
  const router = useRouter();
  const path = usePathname();

  const mutation = trpc.products.createProductContent.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/products/${product.id}/pricing`);
    },
    onError: (error) => {
      maketoast.error();
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof addProductConentNameSchema>>({
    mode: "onChange",
    resolver: zodResolver(addProductConentNameSchema),
    defaultValues: {
      name: product?.title ?? "",
      fileUrl: product.fileUrl ?? "",
      imageUrl: product.thumbnailUrl ?? "",
      breifDescription: product?.subDescription ?? "",
      description: product?.description
        ? JSON.parse(product?.description as string)
        : [
            {
              id: "1",
              type: "p",
              children: [{ text: "" }],
            },
          ],
    },
  });

  async function onSubmit(values: z.infer<typeof addProductConentNameSchema>) {
    console.log("this is the data we are passing");

    console.log({
      description: values.description,
      filrUrl: values.fileUrl,
      productId: product.id,
      name: values.name,
      subDescription: values.breifDescription,
      thumnailUrl: values.imageUrl,
    });

    await mutation.mutateAsync({
      description: values.description,
      filrUrl: values.fileUrl,
      productId: product.id,
      name: values.name,
      subDescription: values.breifDescription,
      thumnailUrl: values.imageUrl,
    });
  }

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("productName")} <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("productNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("addPdfFile")}{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <PdfUploaderS3
                      fileUrl={form.watch("fileUrl")}
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("addImage")}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <ImageUploaderS3
                      fileUrl={form.watch("imageUrl")}
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breifDescription"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    {t("briefDescription")} <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder={t("briefDescriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    {t("productDescription")}{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <CravveloEditor
                      value={form.getValues("description")}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card className="md:hidden">
              <CardContent className="w-full h-fit flex justify-end items-center p-6 gap-x-4 ">
                <Button
                  onClick={() => router.back()}
                  className=" rounded-xl"
                  variant="secondary"
                  type="button"
                >
                  {t("cancelAndGoBack")}
                </Button>
                <Button
                  disabled={mutation.isLoading}
                  type="submit"
                  className=" flex items-center gap-x-2 rounded-xl"
                >
                  {mutation.isLoading ? <LoadingSpinner /> : null}
                  {t("saveAndContinue")}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
      <div className="col-span-1 hidden md:block w-full h-fit self-start">
        <Card className="sticky top-24">
          <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
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

export default ProductContentForm;
