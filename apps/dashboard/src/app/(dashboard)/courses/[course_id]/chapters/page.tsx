import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import CourseHeader from "@/src/components/course-header";
import Chapter from "@/src/components/chapter";
import { User } from "@clerk/nextjs/dist/types/server";

export default async function Home() {
  // const user = await currentUser();

  // if (!user) {
  //   redirect("/sign-in");
  // }

  // console.log(user);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header user={{} as unknown as User} title="ui ux" />
        <CourseHeader />
        <div className="w-full min-h-[100px] ">
          <Chapter />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
