import React from "react";
import LibraryNavigation from "../../../_components/library-navigation";
import { authorization, getStudent } from "../../../_actions/auth";
import { StudentBag } from "@/src/types";
import Link from "next/link";

async function Page() {
  await authorization();

  const student = await getStudent();

  const bag = JSON.parse(student.bag as string) as StudentBag;
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full h-[100px] flex items-center justify-start">
        <h1 className="text-3xl font-bold"> المكتبة الرقمية</h1>
      </div>
      <LibraryNavigation />
      <div className="w-full h-full flex flex-wrap gap-6 my-8">
        <div className="w-full h-[200px] flex items-center justify-center">
          <p className="text-xl font-bold"> سيتم اضافة الشهادات قريبا </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
