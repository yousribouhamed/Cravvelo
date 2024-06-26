import { useRouter } from "next/navigation";
import { makePayment, makePaymentForProduct } from "../_actions/payments";
import toast from "react-hot-toast";

export const GetFreeitem = async ({
  itemId,
  subdomain,
  type,
}: {
  subdomain: string;
  itemId: string;
  type: "COURSE" | "PRODUCT";
}) => {
  const router = useRouter();

  console.log("the funtion is running right know");

  if (type === "COURSE") {
    console.log("we're in the course invocation");
    const url = await makePayment({
      couponCode: null,
      courcesId: [itemId],
      productsId: [],
      subdomain,
    });

    toast("جاري معالجة الطلب", {
      icon: "💸",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    router.push(url);

    return;
  } else {
    const url = await makePaymentForProduct({
      couponCode: null,
      productsId: [itemId],
      subdomain,
    });

    toast("جاري معالجة الطلب", {
      icon: "💸",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    router.push(url);
    return;
  }
};
