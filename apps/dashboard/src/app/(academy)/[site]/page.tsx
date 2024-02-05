import { getPage } from "../actions";
import { notFound } from "next/navigation";
import PagePainterProduction from "../builder-components/page-painter-production";

export const fetchCache = "force-no-store";

interface pageAbdullahProps {
  params: { site: string };
}

function insertDotBeforeJadir(inputString: string): string {
  // Find the index of "jadir"
  const index: number = inputString.indexOf("jadir");

  // Check if "jadir" is found in the string and it's not at the beginning
  if (index !== -1 && index > 0) {
    // Insert a dot before "jadir"
    const modifiedString: string =
      inputString.slice(0, index) + "." + inputString.slice(index);

    return modifiedString;
  } else {
    // Return the original string if "jadir" is not found or it's at the beginning
    return inputString;
  }
}

const Page = async ({ params }: pageAbdullahProps) => {
  console.log("this is the domain");

  console.log(decodeURIComponent(params?.site));

  console.log("the subdomain should be displayed ");

  const page = await getPage({
    path: "/",
    subdomain: decodeURIComponent(params?.site),
  });

  // console.log("this is the page asked");
  // console.log(page);

  if (!page) {
    notFound();
  }

  return <PagePainterProduction page={page} />;
};

export default Page;
