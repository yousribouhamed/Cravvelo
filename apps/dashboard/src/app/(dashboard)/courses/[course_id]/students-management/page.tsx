import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/components/course-header";
import StudentEngagment from "@/src/components/forms/course-forms/students-engagment";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Home() {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header user={user} title="ui ux" goBack />
        <CourseHeader />
        <StudentEngagment />
      </main>
    </MaxWidthWrapper>
  );
}
