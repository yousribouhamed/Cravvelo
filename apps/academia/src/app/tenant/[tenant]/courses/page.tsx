import { getAllCourses } from "@/modules/courses/actions/get-courses";
import CourseCard from "@/modules/courses/components/course-card";

export default async function page() {
  const response = await getAllCourses();

  if (response.success) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {response.data?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Empty state */}
        {response.data?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start creating your first course to see it here.
            </p>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
            Error Loading Courses
          </h1>
          <p className="text-red-700 dark:text-red-300">
            {typeof response.message === "string"
              ? response.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }
}
