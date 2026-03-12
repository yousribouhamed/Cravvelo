"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Rating } from "@smastrom/react-rating";
import { getTestimonials, type TestimonialItem } from "@/actions/testimonials";
import { Card, CardContent } from "@/components/ui/card";

const PAGE_SIZE = 8;

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <Card className="w-full overflow-hidden border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {getInitials(item.reviewerName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{item.reviewerName}</p>
            {item.courseTitle && (
              <p className="text-xs text-muted-foreground truncate">{item.courseTitle}</p>
            )}
          </div>
        </div>
        <Rating value={item.rating} readOnly style={{ maxWidth: 80 }} className="text-yellow-500 mb-2" />
        <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
      </CardContent>
    </Card>
  );
}

interface TestimonialsSectionProps {
  tenant: string;
}

export function TestimonialsSection({ tenant }: TestimonialsSectionProps) {
  const t = useTranslations("home.sections");
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (nextCursor === null || !tenant) return;
    setLoading(true);
    try {
      const { data, nextCursor: next } = await getTestimonials(tenant, nextCursor ?? undefined, PAGE_SIZE);
      setItems((prev) => (nextCursor === undefined ? data : [...prev, ...data]));
      setNextCursor(next);
    } finally {
      setLoading(false);
    }
  }, [tenant, nextCursor]);

  useEffect(() => {
    loadMore();
  }, [tenant]);

  useEffect(() => {
    if (nextCursor === null || nextCursor === undefined || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, nextCursor, loading]);

  return (
    <section className="mt-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{t("testimonials")}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t("testimonialsSubtitle")}</p>
      </div>

      {items.length === 0 && !loading ? (
        <p className="text-muted-foreground text-sm py-6">{t("noReviewsYet")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-2 [scrollbar-width:thin]">
            {items.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-8 w-full" aria-hidden />
          {loading && items.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-2">Loading more…</p>
          )}
        </>
      )}
    </section>
  );
}
