import type { FC } from "react";

interface pageAbdullahProps {}

const Page = async ({ params }: { params: { domain: string } }) => {
  console.log("here it is the domain");
  console.log(params.domain);

  return (
    <div>
      <h1 className="text-4xl font-bold my-20">
        this is your domain name and here you are going to live
      </h1>
    </div>
  );
};

export default Page;
