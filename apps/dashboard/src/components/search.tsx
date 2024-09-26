"use client";

import type { FC } from "react";
import * as React from "react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@ui/components/ui/command";

import { useRouter } from "next/navigation";
import { useDebounce } from "../hooks/use-debounce";
import { Button } from "@ui/components/ui/button";
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
} from "lucide-react";
import { OrangeLoadingSpinner } from "@ui/icons/loading-spinner";
import { SEARCH_MODAL_EN, SEARCH_MODAL_AR } from "@cravvelo/i18n";

interface ProductGroup {
  pages: { name: string; path: string }[];
  products: Product[];
  courses: Course[];
}

interface SearchInputProps {
  lang: string;
}

export const SearchInput: FC<SearchInputProps> = ({ lang }) => {
  const SEARCH_MODAL = lang === "en" ? SEARCH_MODAL_EN : SEARCH_MODAL_AR;

  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [isPending, startTransition] = React.useTransition();
  const [data, setData] = React.useState<ProductGroup | null>(null);

  const mutation = trpc.getUserQuery.useMutation({
    onSuccess: (data) => {
      setData(data);

      setClicked(true);
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
  }, [debouncedQuery, mutation]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mutation]);

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
        {lang === "en" ? (
          <>
            <kbd
              className={`pointer-events-none absolute ${
                lang === "en" ? "right-1.5" : "left-1.5"
              }  top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex`}
            >
              K
              <abbr
                title={isMacOs() ? "Command" : "Control"}
                className="no-underline"
              >
                {isMacOs() ? "⌘" : "Ctrl"}
              </abbr>
            </kbd>
            <MagnifyingGlassIcon
              className={`h-4 w-4  ${lang === "en" ? "xl:mr-2" : "xl:ml-2"}`}
              aria-hidden="true"
            />

            <span className="hidden xl:inline-flex">
              {" "}
              {SEARCH_MODAL.search_input}...
            </span>
            <span className="sr-only">Search </span>
          </>
        ) : (
          <>
            <MagnifyingGlassIcon
              className="h-4 w-4 xl:ml-2"
              aria-hidden="true"
            />
            <span className="hidden xl:inline-flex">
              {" "}
              {SEARCH_MODAL.search_input}...
            </span>
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
          </>
        )}
      </Button>
      <CommandDialog
        title={SEARCH_MODAL.title}
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput
          placeholder={`${SEARCH_MODAL.search_input}...`}
          value={query}
          onValueChange={setQuery}
        />
        {!data && !isPending && !clicked && (
          <div className="w-full h-[300px] pb-2 ">
            <div
              onClick={() => {
                router.push("/settings/payments-methods");
                setOpen(false);
              }}
              className="w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-[50px] h-[45px]  bg-violet-500 rounded-2xl shadow flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                <span className="text-xl font-bold text-black">
                  Payment methods
                </span>
                <span className="text-gray-600 text-start ">
                  There are a lot of things to look for.
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                router.push("/settings/website-settings/appearance");
                setOpen(false);
              }}
              className="w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-[50px] h-[50px]  bg-red-500 rounded-2xl shadow flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center ">
                <span className="text-xl font-bold text-black">
                  Academy Customization
                </span>
                <span className="text-gray-600 text-start ">
                  Edit the colors and logo in the academy
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                router.push("/orders");
                setOpen(false);
              }}
              className="w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-[50px] h-[50px]  bg-blue-500 rounded-2xl shadow flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                <span className="text-xl font-bold text-black">
                  Latest sales
                </span>
                <span className="text-gray-600 text-start ">
                  Every purchase in the academy is considered a sale.
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                router.push("/settings/website-settings/legal");
                setOpen(false);
              }}
              className="w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-[50px] h-[50px]  bg-green-500 rounded-2xl shadow flex items-center justify-center">
                <Warehouse className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                <span className="text-xl font-bold text-black">
                  {" "}
                  Academy Policy
                </span>
                <span className="text-gray-600 text-start ">
                  Protect yourself and your students
                </span>
              </div>
            </div>
          </div>
        )}

        <CommandList>
          {isPending ? (
            <div className="space-y-1 h-[300px] flex items-center justify-center overflow-hidden px-1 py-2">
              <OrangeLoadingSpinner height={50} width={50} />
            </div>
          ) : (
            <>
              {data && data?.products?.length > 0 && (
                <CommandGroup
                  className="capitalize h-[300px]"
                  heading={"المنتجات"}
                >
                  {data?.products.map((item) => {
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        className={
                          "w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
                        }
                        onSelect={() =>
                          handleSelect(() => router.push(`/product/${item.id}`))
                        }
                      >
                        <div className="w-[50px] h-[50px]  bg-green-500 rounded-2xl shadow flex items-center justify-center">
                          <Box className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                        <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                          <span className="text-xl font-bold text-black">
                            {" "}
                            {item.title}
                          </span>
                          <span className="text-gray-600 text-start  truncate">
                            {item?.SeoDescription ?? ""}
                          </span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              <CommandSeparator />

              {data && data?.courses?.length > 0 && (
                <CommandGroup
                  className="capitalize h-[300px]"
                  heading={"Cources"}
                >
                  {data.courses.map((item) => {
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        className={
                          "w-full h-[70px] border-b flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50"
                        }
                        onSelect={() =>
                          handleSelect(() =>
                            router.push(`/courses/${item.id}/chapters`)
                          )
                        }
                      >
                        <div className="w-[50px] h-[50px]  bg-violet-500 rounded-2xl shadow flex items-center justify-center">
                          <Youtube
                            className="w-5 h-5 text-white"
                            strokeWidth={3}
                          />
                        </div>
                        <div className="w-[calc(100%-60px)] h-full flex flex-col items-start justify-center">
                          <span className="text-xl font-bold text-black">
                            {" "}
                            {item.title}
                          </span>
                          <span className="text-gray-600 text-start  truncate">
                            {item?.courseResume ?? ""}
                          </span>
                        </div>
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
