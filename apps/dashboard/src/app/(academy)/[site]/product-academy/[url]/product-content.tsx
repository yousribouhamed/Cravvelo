import { Product } from "database";
import type { FC } from "react";
import { CravveloEditor } from "@cravvelo/editor";

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
        <CravveloEditor
          readOnly
          value={JSON.parse(product?.description as string)}
        />
      </div>
    </div>
  );
};

export default ProductContent;
