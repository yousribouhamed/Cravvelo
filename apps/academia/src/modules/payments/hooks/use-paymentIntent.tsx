import { usePaymentContext } from "../context/payments-provider";
import { PaymentProduct } from "../types";

export const usePaymentIntent = (product: PaymentProduct) => {
  const { setSelectedProduct, openSheet } = usePaymentContext();

  const invokePaymentIntent = () => {
    setSelectedProduct(product);
    openSheet();
  };

  return { invokePaymentIntent };
};
