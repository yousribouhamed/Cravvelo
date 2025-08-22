import { usePaymentContext } from "../context/payments-provider";
import { PaymentProduct } from "../types";

export const usePaymentIntent = (product: PaymentProduct) => {
  const { setSelectedProduct, setSheetOpen, openSheet, isSheetOpen } =
    usePaymentContext();

  const invokePaymentIntent = () => {
    setSelectedProduct(product);

    openSheet();

    console.log("clicked : ", isSheetOpen);
  };

  return { invokePaymentIntent };
};
