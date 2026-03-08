"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const SORT_VALUES = [
  "newest",
  "price_asc",
  "price_desc",
  "rating",
  "students",
] as const;
const LEVEL_VALUES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export function CoursesListFilters() {
  const t = useTranslations("courses.list");
  const tLevel = useTranslations("courses.level");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(searchParam);
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const updateParams = useCallback(
    (updates: { search?: string; level?: string; sort?: string }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }
      if (updates.level !== undefined) {
        if (updates.level) params.set("level", updates.level);
        else params.delete("level");
      }
      if (updates.sort !== undefined) {
        if (updates.sort && updates.sort !== "newest")
          params.set("sort", updates.sort);
        else params.delete("sort");
      }
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateParams({ search: "" });
  };

  const levelParam = searchParams.get("level") ?? "";
  const sortParam = searchParams.get("sort") ?? "newest";
  const levelValue = levelParam || "all";

  const levelLabel =
    levelParam === ""
      ? t("filterLevelAll")
      : tLevel(levelParam.toLowerCase() as "beginner" | "intermediate" | "advanced");

  const sortLabels: Record<(typeof SORT_VALUES)[number], string> = {
    newest: t("sortNewest"),
    price_asc: t("sortPriceAsc"),
    price_desc: t("sortPriceDesc"),
    rating: t("sortRating"),
    students: t("sortStudents"),
  };
  const sortLabel = sortLabels[sortParam as (typeof SORT_VALUES)[number]] ?? t("sortNewest");

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3 mb-6"
    >
      {/* Search bar */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <span className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <Search className="size-4" />
        </span>
        <Input
          name="search"
          type="search"
          placeholder={t("searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-10 ps-10 pe-10 rounded-lg border border-input bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring"
        />
        {searchInput.length > 0 && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Button type="submit" variant="secondary" size="default" className="h-10 rounded-lg">
        {t("searchButton")}
      </Button>

      {/* Level dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 min-w-[140px] justify-between rounded-lg gap-2"
            aria-label={t("filterLevel")}
          >
            <span className="truncate">{levelLabel}</span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[140px] rounded-lg">
          <DropdownMenuRadioGroup
            value={levelValue}
            onValueChange={(v) =>
              updateParams({ level: v === "all" ? undefined : v })
            }
          >
            <DropdownMenuRadioItem value="all">{t("filterLevelAll")}</DropdownMenuRadioItem>
            {LEVEL_VALUES.map((v) => (
              <DropdownMenuRadioItem key={v} value={v}>
                {tLevel(v.toLowerCase())}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 min-w-[160px] justify-between rounded-lg gap-2"
            aria-label={t("sortLabel")}
          >
            <span className="truncate">{sortLabel}</span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px] rounded-lg">
          <DropdownMenuRadioGroup
            value={sortParam}
            onValueChange={(v) =>
              updateParams({
                sort: (v as (typeof SORT_VALUES)[number]) || undefined,
              })
            }
          >
            {SORT_VALUES.map((v) => (
              <DropdownMenuRadioItem key={v} value={v}>
                {sortLabels[v]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}
