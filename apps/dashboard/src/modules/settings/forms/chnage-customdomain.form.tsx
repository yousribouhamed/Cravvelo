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
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import DomainStatus from "@/src/components/domain-status";
import DomainConfiguration from "@/src/components/domain-configuration";
import { Skeleton } from "@ui/components/ui/skeleton";
import { useDomainStatus } from "@/src/hooks/use-domain-status";
import { useEffect, useState } from "react";

interface AddCustomDomain {
  customDomain: string | null;
}

const formSchema = z.object({
  cutomedomain: z.string(),
});

// Skeleton component for domain configuration loading
const DomainConfigurationSkeleton = () => {
  return (
    <div className="space-y-4 p-6 border-t border-gray-200 dark:border-gray-700">
      {/* Status indicator skeleton */}
      <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* DNS Record skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <Skeleton className="h-4 w-64 mb-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start space-x-3">
            <Skeleton className="h-5 w-5 rounded-full mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for domain status indicator
const DomainStatusSkeleton = () => {
  return <Skeleton className="h-4 w-4 rounded-full" />;
};

const AddCustomDomainForm: FC<AddCustomDomain> = ({ customDomain }) => {
  const [showConfigSkeleton, setShowConfigSkeleton] = useState(false);

  const mutation = trpc.setCustomDomain.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: (err) => {
      console.error(err);
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cutomedomain: customDomain ? customDomain : "",
    },
  });

  const watchedDomain = form.watch("cutomedomain");

  // Get domain status to check loading state
  const {
    status,
    domainJson,
    loading: isDomainStatusLoading,
  } = useDomainStatus({
    domain: watchedDomain,
  });

  // Show skeleton for a brief moment when domain changes to indicate loading
  useEffect(() => {
    if (watchedDomain) {
      setShowConfigSkeleton(true);
      const timer = setTimeout(() => {
        setShowConfigSkeleton(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowConfigSkeleton(false);
    }
  }, [watchedDomain]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      customdomain: data?.cutomedomain,
    });
  }

  const shouldShowDomainConfig =
    watchedDomain && !showConfigSkeleton && !isDomainStatusLoading;
  const shouldShowSkeleton =
    watchedDomain && (showConfigSkeleton || isDomainStatusLoading);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border h-full w-full rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>مجال مخصص</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="cutomedomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النطاق المخصص لموقعك.</FormLabel>
                  <div className="relative flex w-full">
                    <FormControl>
                      <Input
                        placeholder="yourdomain.com"
                        {...field}
                        className="z-10 flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                      />
                    </FormControl>
                    <div className="absolute left-3 z-10 flex h-full items-center">
                      {watchedDomain && (
                        <>
                          {isDomainStatusLoading ? (
                            <DomainStatusSkeleton />
                          ) : (
                            <DomainStatus domain={watchedDomain} />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Domain Configuration Section */}
            {shouldShowSkeleton && (
              <div dir="ltr" className="w-full min-h-[300px] h-fit">
                <DomainConfigurationSkeleton />
              </div>
            )}

            {shouldShowDomainConfig && (
              <div dir="ltr" className="w-full min-h-[300px] h-fit">
                <DomainConfiguration domain={watchedDomain} />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="flex items-center gap-x-2"
              disabled={mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              تاكيد
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddCustomDomainForm;
