import { getCourseWithChapters } from "@/modules/profile/actions/course.actions";

interface PageProps {
  params: Promise<{
    tenant: string;
    courseId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;

  const res = await getCourseWithChapters({ courseId });

  console.log(res.data?.Chapter);

  if (res.data) {
    return (
      <div className="w-full h-full ">
        <h1>we fetched the coutse</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>error</h1>
    </div>
  );
}
