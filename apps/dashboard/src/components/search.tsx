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

const DEFAULT_PAGES = [
  {
    name: "طرق الدفع",
    path: "/settings/payments-methods",
    description: "إدارة طرق الدفع والفواتير",
    icon: CreditCard,
  },
  {
    name: "المظهر",
    path: "/settings/website-settings/appearance",
    description: "تخصيص الألوان والشعار والقالب",
    icon: Palette,
  },
  {
    name: "المبيعات الأخيرة",
    path: "/orders",
    description: "تتبع المبيعات والطلبات الحديثة",
    icon: TrendingUp,
  },
  {
    name: "إعدادات الأكاديمية",
    path: "/settings/website-settings/legal",
    description: "إدارة الشروط والأحكام والخصوصية",
    icon: Settings,
  },
];

export const SearchInput: FC = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 500); // Increased debounce time
  const [data, setData] = React.useState<ProductGroup | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  const mutation = trpc.getUserQuery.useMutation({
    onSuccess: (data) => {
      setData(data);
      setError(null);
      setIsSearching(false);
    },
    onError: (error) => {
      console.error("Search error:", error);
      setError(error.message || "حدث خطأ في البحث");
      maketoast.error("فشل في البحث. حاول مرة أخرى.");
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
        setError("انتهت مهلة البحث. حاول مرة أخرى.");
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
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-9 bg-card w-full max-w-sm justify-start px-3 text-right font-normal 
                   border border-gray-200 dark:border-gray-700 
                   hover:border-blue-300 dark:hover:border-blue-600
                   hover:bg-blue-50 dark:hover:bg-blue-950
                   transition-all duration-200 hover:shadow-sm"
        onClick={() => setOpen(true)}
        dir="rtl"
      >
        <Search className="ml-2 h-4 w-4 text-gray-400" />
        <span className="flex-1 text-gray-500 text-sm">
          البحث في الدورات والمنتجات...
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen} title="البحث">
        <div dir="rtl">
          <CommandInput
            placeholder="ابحث عن أي شيء..."
            value={query}
            onValueChange={setQuery}
            className="text-right"
          />

          <CommandList>
            {/* Error State */}
            {error && (
              <div
                className="flex items-center gap-2 p-4 text-red-600 dark:text-red-400"
                dir="rtl"
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
                  dir="rtl"
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span>جاري البحث...</span>
                </div>
                <SearchSkeleton />
              </div>
            )}

            {/* Default Pages (when no query) */}
            {showDefaultPages && (
              <CommandGroup heading="الصفحات المقترحة">
                {DEFAULT_PAGES.map((page) => (
                  <CommandItem
                    key={page.path}
                    value={page.name}
                    onSelect={() => handleSelect(page.path)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mx-2"
                    dir="rtl"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                      <page.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-right truncate">
                        {page.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 text-right truncate">
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
                    dir="rtl"
                  >
                    تم العثور على {totalResults} نتيجة
                  </div>
                )}

                {/* Products */}
                {data.products && data.products.length > 0 && (
                  <CommandGroup heading={`المنتجات (${data.products.length})`}>
                    {data.products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.title}
                        onSelect={() => handleSelect(`/product/${product.id}`)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mx-2"
                        dir="rtl"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900 flex-shrink-0">
                          <Box className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-right truncate">
                            {product.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 text-right truncate">
                            {product.SeoDescription ||
                              product.subDescription ||
                              "منتج رقمي"}
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
                  <CommandGroup heading={`الدورات (${data.courses.length})`}>
                    {data.courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        value={course.title}
                        onSelect={() =>
                          handleSelect(`/courses/${course.id}/chapters`)
                        }
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mx-2"
                        dir="rtl"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900 flex-shrink-0">
                          <Youtube className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-right truncate">
                            {course.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 text-right truncate">
                            {course.courseResume || "دورة تعليمية"}
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
                    لم يتم العثور على نتائج
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                    جرب كلمات مفتاحية مختلفة أو تحقق من الإملاء
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
