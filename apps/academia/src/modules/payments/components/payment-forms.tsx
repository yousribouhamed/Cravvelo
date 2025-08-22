import { usePaymentContext } from "../context/payments-provider";
import { ChargilyForm } from "./forms/chargily-form";
import { P2PForm } from "./forms/p2p-form";

export function PaymentForms() {
  const { paymentMethod } = usePaymentContext();

  switch (paymentMethod) {
    case "chargily":
      return <ChargilyForm />;

    case "p2p":
      return <P2PForm />;

    default:
      return null;
  }
}
