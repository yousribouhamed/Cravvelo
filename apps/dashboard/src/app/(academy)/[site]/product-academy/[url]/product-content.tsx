import { Product } from "database";
import type { FC } from "react";
import CourseDescription from "../../../_components/course-component/course-description";
import { PlateEditorReactOnly } from "@/src/components/reich-text-editor/read-only";

interface productContentProps {
  product: Product;
}

const ProductContent: FC<productContentProps> = ({ product }) => {
  return (
    <div className="w-full my-4 min-h-[300px] h-fit flex flex-col rounded-xl">
      <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
        <h3 className="text-xl font-bold">وصف المنتج</h3>
      </div>
      <div className="w-full min-h-[200px] h-fit ">
        <PlateEditorReactOnly
          value={JSON.parse(product?.description as string)}
        />
      </div>
    </div>
  );
};

export default ProductContent;
