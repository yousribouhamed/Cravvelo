"use client";

import type { FC } from "react";
import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@ui/components/ui/command";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "../hooks/use-debounce";
import { Button } from "@ui/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { isMacOs } from "../lib/utils";
import { cn } from "@ui/lib/utils";
import { Course, Product } from "database";
import { trpc } from "../app/_trpc/client";
import { maketoast } from "./toasts";
import { Skeleton } from "@ui/components/ui/skeleton";

interface ProductGroup {
  pages: { name: string; path: string }[];
  products: Product[];
  courses: Course[];
}

export const SearchInput: FC = ({}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [isPending, startTransition] = React.useTransition();
  const [data, setData] = React.useState<ProductGroup | null>(null);

  const mutation = trpc.getUserQuery.useMutation({
    onSuccess: (data) => {
      setData(data);

      console.log("this is the query data");
      console.log(data);
    },
    onError: () => {
      maketoast.error();
    },
  });

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null);
      return;
    }

    async function fetchData() {
      await mutation.mutateAsync({
        query: debouncedQuery,
      });
    }

    startTransition(fetchData);

    return () => setData(null);
  }, [debouncedQuery]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false);
    callback();
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        className="relative hidden md:flex h-9 w-9 p-0 xl:h-10 md:justify-start md:px-3 md:py-4 md:w-[641px] border rounded-xl bg-white "
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="h-4 w-4 xl:ml-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex"> بحث...</span>
        <span className="sr-only">Search </span>
        <kbd className="pointer-events-none absolute left-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          K
          <abbr
            title={isMacOs() ? "Command" : "Control"}
            className="no-underline"
          >
            {isMacOs() ? "⌘" : "Ctrl"}
          </abbr>
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="يبحث..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No products found.
          </CommandEmpty>
          {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            <>
              {data && data?.products?.length > 0 && (
                <CommandGroup className="capitalize" heading={"products"}>
                  {data?.products.map((item) => {
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() =>
                          handleSelect(() => router.push(`/product/${item.id}`))
                        }
                      >
                        <span className="truncate">{item.title}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {data && data?.courses?.length > 0 && (
                <CommandGroup className="capitalize" heading={"courses"}>
                  {data.courses.map((item) => {
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() =>
                          handleSelect(() => router.push(`/product/${item.id}`))
                        }
                      >
                        <span className="truncate">{item.title}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
