"use client";

import type { FC } from "react";
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@ui/components/ui/command";

import { useRouter } from "next/navigation";
import { useDebounce } from "../hooks/use-debounce";
import { Button } from "@ui/components/ui/button";
import { Skeleton } from "@ui/components/ui/skeleton";
import { Search, Command } from "lucide-react";
import { Course, Product } from "database";
import { trpc } from "../app/_trpc/client";
import { maketoast } from "./toasts";
import {
  Box,
  Youtube,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Settings,
  CreditCard,
  Palette,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import { cn } from "@ui/lib/utils";

interface ProductGroup {
  pages: { name: string; path: string }[];
  products: Product[];
  courses: Course[];
}

const SearchSkeleton = () => (
  <div className="space-y-3 p-3">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
        <div className="flex-shrink-0">
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full max-w-[200px]" />
          <Skeleton className="h-3 w-full max-w-[150px]" />
        </div>
        <div className="flex-shrink-0">
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </div>
    ))}
    <div className="px-3 py-2">
      <Skeleton className="h-px w-full" />
    </div>
    {[...Array(2)].map((_, i) => (
      <div
        key={`group-${i}`}
        className="flex items-center space-x-3 p-3 rounded-lg"
      >
        <div className="flex-shrink-0">
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full max-w-[180px]" />
          <Skeleton className="h-3 w-full max-w-[120px]" />
        </div>
      </div>
    ))}
  </div>
);

export const SearchInput: FC = () => {
  const t = useTranslations("search");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 500); // Increased debounce time
  const [data, setData] = React.useState<ProductGroup | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isMac, setIsMac] = React.useState(true); // default for SSR; detect on mount

  React.useEffect(() => {
    const platform = typeof navigator !== "undefined" ? navigator.platform ?? navigator.userAgent : "";
    setIsMac(/Mac|iPod|iPhone|iPad/i.test(platform));
  }, []);

  const DEFAULT_PAGES = useMemo(
    () => [
      {
        name: t("defaultPages.paymentMethods"),
        path: "/settings/payments-methods",
        description: t("defaultPages.paymentMethodsDesc"),
        icon: CreditCard,
        iconBg: "bg-blue-100 dark:bg-blue-900/50",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        name: t("defaultPages.appearance"),
        path: "/settings/website-settings/appearance",
        description: t("defaultPages.appearanceDesc"),
        icon: Palette,
        iconBg: "bg-amber-100 dark:bg-amber-900/50",
        iconColor: "text-amber-600 dark:text-amber-400",
      },
      {
        name: t("defaultPages.recentSales"),
        path: "/orders",
        description: t("defaultPages.recentSalesDesc"),
        icon: TrendingUp,
        iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      },
      {
        name: t("defaultPages.academySettings"),
        path: "/settings/website-settings/legal",
        description: t("defaultPages.academySettingsDesc"),
        icon: Settings,
        iconBg: "bg-violet-100 dark:bg-violet-900/50",
        iconColor: "text-violet-600 dark:text-violet-400",
      },
    ],
    [t]
  );

  const mutation = trpc.getUserQuery.useMutation({
    onSuccess: (data) => {
      setData(data);
      setError(null);
      setIsSearching(false);
    },
    onError: (error) => {
      console.error("Search error:", error);
      setError(error.message || t("searchError"));
      maketoast.error(t("searchFailed"));
      setIsSearching(false);
      setData(null);
    },
  });

  React.useEffect(() => {
    // Reset states when query is cleared
    if (debouncedQuery.length <= 0) {
      setData(null);
      setError(null);
      setIsSearching(false);
      return;
    }

    // Don't search for very short queries
    if (debouncedQuery.length < 2) {
      return;
    }

    // Start searching
    setIsSearching(true);
    setError(null);
    setData(null); // Clear previous results

    // Add timeout to handle slow API responses
    const timeoutId = setTimeout(() => {
      if (isSearching) {
        setError(t("searchTimeout"));
        setIsSearching(false);
      }
    }, 10000); // 10 second timeout

    mutation.mutate(
      { query: debouncedQuery },
      {
        onSettled: () => {
          clearTimeout(timeoutId);
        },
      }
    );

    return () => clearTimeout(timeoutId);
  }, [debouncedQuery]);

  // Keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle item selection
  const handleSelect = React.useCallback(
    (path: string) => {
      setOpen(false);
      router.push(path);
    },
    [router]
  );

  // Reset query when dialog closes
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setData(null);
      setError(null);
      setIsSearching(false);
    }
  }, [open]);

  const showDefaultPages = !query && !data && !isSearching;
  const showSearchResults = query && data && !isSearching;
  const showNoResults =
    query &&
    !isSearching &&
    data &&
    (!data.products || data.products.length === 0) &&
    (!data.courses || data.courses.length === 0) &&
    (!data.pages || data.pages.length === 0);

  const totalResults = React.useMemo(() => {
    if (!data) return 0;
    return (
      (data.products?.length || 0) +
      (data.courses?.length || 0) +
      (data.pages?.length || 0)
    );
  }, [data]);

  return (
    <>
      {/* Search Trigger Button - same height as notification (h-10), more width on desktop, platform-aware shortcut */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-10 px-3 font-normal w-full lg:w-auto lg:min-w-[220px] lg:max-w-[320px]",
          "bg-card border border-border rounded-xl",
          "hover:border-blue-300 dark:hover:border-blue-600",
          "hover:bg-blue-50/80 dark:hover:bg-blue-950/50",
          "transition-all duration-200 hover:shadow-sm",
          isRTL ? "justify-start text-right" : "justify-start text-left"
        )}
        onClick={() => setOpen(true)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Search className={cn("h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0", isRTL ? "ml-2" : "mr-2")} />
        <span className={cn("flex-1 text-gray-600 dark:text-gray-300 text-sm truncate", isRTL ? "text-right" : "text-left")}>
          {t("placeholder")}
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:inline-flex">
          {isMac ? (
            <Command className="h-3 w-3" aria-hidden />
          ) : (
            <span className="text-[10px] font-semibold">Ctrl</span>
          )}
          K
        </kbd>
      </Button>

      {/* Search Dialog - improved spacing and max height for UX */}
      <CommandDialog open={open} onOpenChange={setOpen} title={t("dialogTitle")} className="max-h-[85vh]">
        <div dir={isRTL ? "rtl" : "ltr"} className="p-1">
          <CommandInput
            placeholder={t("searchPlaceholder")}
            value={query}
            onValueChange={setQuery}
            className={cn("h-11 rounded-lg", isRTL ? "text-right" : "text-left")}
          />

          <CommandList className="max-h-[min(60vh,400px)] py-2">
            {/* Error State */}
            {error && (
              <div
                className="flex items-center gap-2 p-4 text-red-600 dark:text-red-400"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="p-2">
                <div
                  className="flex items-center gap-2 p-3 text-sm text-gray-600 dark:text-gray-400"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span>{t("searching")}</span>
                </div>
                <SearchSkeleton />
              </div>
            )}

            {/* Default Pages (when no query) - colorful icons and improved UX */}
            {showDefaultPages && (
              <CommandGroup heading={t("suggestedPages")} className="px-2">
                {DEFAULT_PAGES.map((page) => (
                  <CommandItem
                    key={page.path}
                    value={page.name}
                    onSelect={() => handleSelect(page.path)}
                    className={cn(
                      "flex items-center gap-3 p-3.5 cursor-pointer rounded-xl mx-1 my-0.5 transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800/80",
                      "data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800/80",
                      "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    )}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 ring-1 ring-black/5 dark:ring-white/10",
                        page.iconBg
                      )}
                    >
                      <page.icon className={cn("h-5 w-5", page.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-semibold truncate", isRTL ? "text-right" : "text-left")}>
                        {page.name}
                      </div>
                      <div className={cn("text-xs text-muted-foreground truncate mt-0.5", isRTL ? "text-right" : "text-left")}>
                        {page.description}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Search Results */}
            {showSearchResults && (
              <>
                {totalResults > 0 && (
                  <div
                    className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("resultsFound", { count: totalResults })}
                  </div>
                )}

                {/* Products */}
                {data.products && data.products.length > 0 && (
                  <CommandGroup heading={`${t("products")} (${data.products.length})`} className="px-2">
                    {data.products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.title}
                        onSelect={() => handleSelect(`/products/${product.id}/content`)}
                        className={cn(
                          "flex items-center gap-3 p-3.5 cursor-pointer rounded-xl mx-1 my-0.5 transition-colors",
                          "hover:bg-gray-100 dark:hover:bg-gray-800/80 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        )}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0 ring-1 ring-black/5 dark:ring-white/10">
                          <Box className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("font-medium truncate", isRTL ? "text-right" : "text-left")}>
                            {product.title}
                          </div>
                          <div className={cn("text-xs text-gray-600 dark:text-gray-400 truncate", isRTL ? "text-right" : "text-left")}>
                            {product.SeoDescription ||
                              product.subDescription ||
                              t("digitalProduct")}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Separator */}
                {data.products &&
                  data.products.length > 0 &&
                  data.courses &&
                  data.courses.length > 0 && <CommandSeparator />}

                {/* Courses */}
                {data.courses && data.courses.length > 0 && (
                  <CommandGroup heading={`${t("courses")} (${data.courses.length})`} className="px-2">
                    {data.courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        value={course.title}
                        onSelect={() =>
                          handleSelect(`/courses/${course.id}/chapters`)
                        }
                        className={cn(
                          "flex items-center gap-3 p-3.5 cursor-pointer rounded-xl mx-1 my-0.5 transition-colors",
                          "hover:bg-gray-100 dark:hover:bg-gray-800/80 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        )}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/50 flex-shrink-0 ring-1 ring-black/5 dark:ring-white/10">
                          <Youtube className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("font-medium truncate", isRTL ? "text-right" : "text-left")}>
                            {course.title}
                          </div>
                          <div className={cn("text-xs text-gray-600 dark:text-gray-400 truncate", isRTL ? "text-right" : "text-left")}>
                            {course.courseResume || t("courses")}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}

            {/* Empty State */}
            {showNoResults && (
              <CommandEmpty>
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    {t("noResults")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                    {t("noResultsDescription")}
                  </p>
                </div>
              </CommandEmpty>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
};
