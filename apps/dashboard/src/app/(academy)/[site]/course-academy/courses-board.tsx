"use client";

import { useState, type FC } from "react";
import FilterButtonMobile from "../../_components/filter-button";
import CoursesGrid from "../../_components/course-component/courses-grid";
import { Course, Website } from "database";
import { useQuery } from "@tanstack/react-query";
import { getCoursesButFiltered } from "../../_actions/course";
import { CourseWithEpisode } from "@/src/types";

interface CoursesBoardProps {
  website: Website;
  courses: CourseWithEpisode[];
}

const AVAILABLE_FILTER_VALUES = {
  level: ["BEGINNER", "INTERMIDIATE", "ADVANCED"],
  rating: [5, 4, 3],
  price: ["paid", "free"],
};

type Tfilter = {
  level: string[];
  rating: number[];
  price: string[];
};

const CoursesBoard: FC<CoursesBoardProps> = ({ courses, website }) => {
  const [data, setData] = useState<CourseWithEpisode[]>(courses);

  const [filterState, setFilterState] = useState<Tfilter>({
    level: AVAILABLE_FILTER_VALUES.level,
    price: AVAILABLE_FILTER_VALUES.price,
    rating: AVAILABLE_FILTER_VALUES.rating,
  });

  return (
    <div className="w-full h-fit min-h-screen ">
      <div className="w-full h-[100px] flex items-center justify-between">
        <h1 className="text-3xl font-bold">الدورات التدربية</h1>
        {/* <div className="md:hidden">
          <FilterButtonMobile color={website?.color} />
        </div> */}
      </div>
      <CoursesGrid courses={data} color={website?.color} />
    </div>
  );
};

export default CoursesBoard;
