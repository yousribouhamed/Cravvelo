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
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { isMacOs } from "../lib/utils";
import { Course, Product } from "database";
import { trpc } from "../app/_trpc/client";
import { maketoast } from "./toasts";
import {
  Box,
  Gem,
  Ghost,
  Palette,
  PiggyBank,
  Warehouse,
  Youtube,
  AlertCircle,
} from "lucide-react";

interface ProductGroup {
  pages: { name: string; path: string }[];
  products: Product[];
  courses: Course[];
}

interface SearchResult {
  type: 'product' | 'course' | 'page';
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Skeleton component for loading states
const SearchSkeleton = () => (
  <div className="space-y-1 p-2">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ))}
  </div>
);

const DEFAULT_PAGES = [
  {
    name: "وسائل الدفع",
    path: "/settings/payments-methods",
    description: "هناك الكثير من الامور للبحث عنها",
    icon: PiggyBank,
    color: "bg-violet-500",
  },
  {
    name: "تخصيص الاكادمية",
    path: "/settings/website-settings/appearance",
    description: "عدل الالوان و الشعار في الأكاديمية",
    icon: Palette,
    color: "bg-red-500",
  },
  {
    name: "اخر المبيعات",
    path: "/orders",
    description: "كل عملية شراء في الأكاديمية تعتبر مبيعة",
    icon: Gem,
    color: "bg-blue-500",
  },
  {
    name: "سياسة الاكاديمية",
    path: "/settings/website-settings/legal",
    description: "احم نفسك و طلابك",
    icon: Warehouse,
    color: "bg-green-500",
  },
];

export const SearchInput: FC = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
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
      setError(error.message || "حدث خطأ في البحث");
      maketoast.error();
      setIsSearching(false);
    },
  });

  // Fetch data when query changes
  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null);
      setError(null);
      setIsSearching(false);
      return;
    }

    if (debouncedQuery.length < 2) {
      return; // Don't search for very short queries
    }

    setIsSearching(true);
    setError(null);

    mutation.mutate({
      query: debouncedQuery,
    });
  }, [debouncedQuery]); // Remove mutation from dependencies to prevent infinite loop

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
  const handleSelect = React.useCallback((callback: () => void) => {
    setOpen(false);
    callback();
  }, []);

  // Reset query when dialog closes
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setData(null);
      setError(null);
      setIsSearching(false);
    }
  }, [open]);

  // Transform data into search results
  const searchResults = React.useMemo((): SearchResult[] => {
    if (!data) return [];

    const results: SearchResult[] = [];

    // Add products
    data.products.forEach((product) => {
      results.push({
        type: 'product',
        id: product.id,
        title: product.title,
        description: product.SeoDescription || product.subDescription || "",
        path: `/product/${product.id}`,
        icon: Box,
        color: "bg-green-500",
      });
    });

    // Add courses
    data.courses.forEach((course) => {
      results.push({
        type: 'course',
        id: course.id,
        title: course.title,
        description: course.courseResume || "",
        path: `/courses/${course.id}/chapters`,
        icon: Youtube,
        color: "bg-violet-500",
      });
    });

    return results;
  }, [data]);

  const showDefaultPages = !query && !data && !isSearching;
  const showSearchResults = query && (data || isSearching);
  const showNoResults = query && data && searchResults.length === 0 && !isSearching;

  return (
    <>
      <Button
        variant="ghost"
        className="relative hidden md:flex h-9 w-9 p-0 xl:h-10 md:justify-start md:px-3 md:py-4 md:w-[641px] border rounded-xl bg-white"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="h-4 w-4 xl:ml-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">بحث...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute left-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <abbr
            title={isMacOs() ? "Command" : "Control"}
            className="no-underline"
          >
            {isMacOs() ? "⌘" : "Ctrl"}
          </abbr>
          K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="ابحث عن الدورات والمنتجات والصفحات..."
          value={query}
          onValueChange={setQuery}
        />

        <CommandList>
          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center p-4 text-red-500">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isSearching && <SearchSkeleton />}

          {/* Default Pages (when no query) */}
          {showDefaultPages && (
            <CommandGroup heading="الصفحات الرئيسية">
              {DEFAULT_PAGES.map((page) => (
                <CommandItem
                  key={page.path}
                  value={page.name}
                  className="w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
                  onSelect={() => handleSelect(() => router.push(page.path))}
                >
                  <div className={`w-[50px] h-[50px] ${page.color} rounded-2xl shadow flex items-center justify-center`}>
                    <page.icon className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                    <span className="text-xl font-bold text-black">
                      {page.name}
                    </span>
                    <span className="text-gray-600 text-start">
                      {page.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Search Results */}
          {showSearchResults && !isSearching && (
            <>
              {/* Products */}
              {data?.products && data.products.length > 0 && (
                <CommandGroup heading="المنتجات">
                  {data.products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.title}
                      className="w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
                      onSelect={() =>
                        handleSelect(() => router.push(`/product/${product.id}`))
                      }
                    >
                      <div className="w-[50px] h-[50px] bg-green-500 rounded-2xl shadow flex items-center justify-center">
                        <Box className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                        <span className="text-xl font-bold text-black">
                          {product.title}
                        </span>
                        <span className="text-gray-600 text-start truncate">
                          {product.SeoDescription || product.subDescription || ""}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Courses */}
              {data?.courses && data.courses.length > 0 && (
                <>
                  {data.products && data.products.length > 0 && <CommandSeparator />}
                  <CommandGroup heading="الدورات">
                    {data.courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        value={course.title}
                        className="w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
                        onSelect={() =>
                          handleSelect(() =>
                            router.push(`/courses/${course.id}/chapters`)
                          )
                        }
                      >
                        <div className="w-[50px] h-[50px] bg-violet-500 rounded-2xl shadow flex items-center justify-center">
                          <Youtube className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                        <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                          <span className="text-xl font-bold text-black">
                            {course.title}
                          </span>
                          <span className="text-gray-600 text-start truncate">
                            {course.courseResume || ""}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </>
          )}

          {/* Empty State */}
          {showNoResults && (
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Ghost className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-500 text-sm">
                  جرب البحث بكلمات مختلفة أو تحقق من الإملاء
                </p>
              </div>
            </CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};