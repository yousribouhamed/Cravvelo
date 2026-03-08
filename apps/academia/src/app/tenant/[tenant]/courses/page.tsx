import { ListEmptyState } from "@/components/list-empty-state";
import { getCoursesWithDefaultPricing } from "@/modules/courses/actions/get-courses";
import CourseCard from "@/modules/courses/components/course-card";
import { CoursesListFilters } from "@/modules/courses/components/courses-list-filters";
import { getTranslations } from "next-intl/server";
import { BookOpen } from "lucide-react";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function page({ searchParams }: PageProps) {
  const t = await getTranslations("courses.list");
  const sp = searchParams ? await searchParams : {};
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const level =
    typeof sp.level === "string" &&
    ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(sp.level)
      ? (sp.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")
      : undefined;
  const sort =
    typeof sp.sort === "string" &&
    ["newest", "price_asc", "price_desc", "rating", "students"].includes(sp.sort)
      ? (sp.sort as "newest" | "price_asc" | "price_desc" | "rating" | "students")
      : undefined;

  const response = await getCoursesWithDefaultPricing({
    search,
    level,
    sort,
  });

  if (response.success) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-start text-black dark:text-white">
          {t("title")}
        </h1>
        <CoursesListFilters />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 auto-rows-fr">
          {response.data?.map((course) => (
            <CourseCard key={course.id} course={course as any} />
          ))}
        </div>

        {response.data?.length === 0 && (
          <ListEmptyState
            icon={<BookOpen />}
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            actionLabel={t("backToHome")}
            actionHref="/"
          />
        )}
      </div>
    );
  } else {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2 text-start">
            {t("loadErrorTitle")}
          </h1>
          <p className="text-red-700 dark:text-red-300 text-start">
            {typeof response.message === "string"
              ? response.message
              : t("genericError")}
          </p>
        </div>
      </div>
    );
  }
}
