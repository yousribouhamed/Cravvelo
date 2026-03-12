import { CreditCard, Smartphone, Check } from "lucide-react";
import { usePaymentContext } from "../context/payments-provider";
import { useTranslations } from "next-intl";

export function PaymentMethodCards() {
  const { activeConnections, paymentMethod, setPaymentMethod } =
    usePaymentContext();
  const t = useTranslations("payments");

  const hasChargily = activeConnections.some(
    (conn) => conn.provider === "CHARGILY" && conn.isActive
  );

  const hasP2P = activeConnections.some(
    (conn) => conn.provider === "P2P" && conn.isActive
  );

  if (activeConnections.length === 0) {
    return (
      <div className="col-span-2 text-center py-8 text-muted-foreground">
        {t("noPaymentMethods")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Chargily Payment Method */}
      {hasChargily && (
        <div
          className={`border-2 rounded-lg p-4 min-h-[72px] cursor-pointer transition-all active:scale-[0.98] ${
            paymentMethod === "chargily"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/50 bg-card"
          }`}
          onClick={() => setPaymentMethod("chargily")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "chargily"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/50"
              }`}
            >
              {paymentMethod === "chargily" && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <CreditCard className="w-8 h-8 text-primary" />
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                {t("chargilyTitle")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("chargilyDescription")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* P2P Payment Method */}
      {hasP2P && (
        <div
          className={`border-2 rounded-lg p-4 min-h-[72px] cursor-pointer transition-all active:scale-[0.98] ${
            paymentMethod === "p2p"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/50 bg-card"
          }`}
          onClick={() => setPaymentMethod("p2p")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "p2p"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/50"
              }`}
            >
              {paymentMethod === "p2p" && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <Smartphone className="w-8 h-8 text-primary" />
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                {t("p2pTitle")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("p2pDescription")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for no active methods */}
      {!hasChargily && !hasP2P && (
        <div className="col-span-2 text-center py-8">
          <div className="text-muted-foreground">
            {t("noActivePaymentMethods")}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {t("noActivePaymentMethodsHint", {
              count: activeConnections.length,
            })}
          </div>
        </div>
      )}
    </div>
  );
}
