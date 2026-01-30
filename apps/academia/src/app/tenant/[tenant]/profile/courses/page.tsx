import { getStudentCourses } from "@/modules/profile/actions/courses.actions";
import CoursesTable from "@/modules/profile/components/courses-table";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const res = await getStudentCourses();
  const t = await getTranslations("profile.courses");

  if (res.data && res.data.length > 0) {
    return (
      <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border">
        <h2 className="font-bold text-xl">{t("title")}</h2>
        <CoursesTable data={res.data} />
      </div>
    );
  }

  return (
    <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border">
      <h2 className="font-bold text-xl">{t("title")}</h2>
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">{t("empty")}</p>
      </div>
    </div>
  );
}
