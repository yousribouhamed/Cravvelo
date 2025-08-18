import { getAllCourses } from "@/modules/courses/actions/get-courses";
import CourseCard from "@/modules/courses/components/course-card";

export default async function page() {
  const response = await getAllCourses();

  console.log(response);

  if (response.success) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Courses </h1>
        <div className="w-full h-fit  ">
          {response.data?.map((item) => (
            <CourseCard {...item} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-8 bg-red-950">
        <h1 className="text-3xl font-bold mb-4">error </h1>
      </div>
    );
  }
}
