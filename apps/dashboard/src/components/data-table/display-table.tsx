import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import { NotFoundCard } from "../not-found-card";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Course } from "database";
import { formatDZD } from "@/src/lib/utils";

export function TableBestCoursesSales({ courses }: { courses: Course[] }) {
  return (
    <Table className="w-full h-[300px]">
      <TableHeader className="bg-primary">
        <TableRow>
          <TableHead className=" text-white text-right">اسم الدورة</TableHead>
          <TableHead className="text-white text-right">عدد الطلاب</TableHead>
          <TableHead className="text-white text-right">سعر الدورة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full bg-black">
        {courses.length === 0 ? (
          <NotFoundCard />
        ) : (
          <ScrollArea className="w-full h-[250px]">
            <div className="w-full h-fit   flex flex-col ">
              {courses.map((course) => (
                <TableRow className="w-full" key={course.id}>
                  <TableCell className="font-medium text-right">
                    {course.title}
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    {course.studentsNbr}
                  </TableCell>
                  <TableCell className="text-right">
                    {course.price !== 0 ? formatDZD(course.price) : "free"}
                  </TableCell>
                </TableRow>
              ))}
            </div>
          </ScrollArea>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>المجموع</TableCell>
          <TableCell className="text-left">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
