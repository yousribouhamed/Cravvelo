import { useState } from "react";
import { CreditCard, Smartphone, Check } from "lucide-react";

interface PaymentConnection {
  provider: string;
  isActive: boolean;
}

export function PaymentMethodCards() {
  // Example: you can initialize these however you like
  const [activeConnections] = useState<PaymentConnection[]>([
    { provider: "CHARGILY", isActive: true },
    // { provider: "P2P", isActive: true },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const hasChargily = activeConnections.some(
    (conn) => conn.provider === "CHARGILY" && conn.isActive
  );

  const hasP2P = activeConnections.some(
    (conn) => conn.provider === "P2P" && conn.isActive
  );

  if (activeConnections.length === 0) {
    return (
      <div className="col-span-2 text-center py-8 text-muted-foreground">
        لا توجد طرق دفع متاحة حالياً
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Chargily Payment Method */}
      {hasChargily && (
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            paymentMethod === "chargily"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400"
              : "border-border hover:border-muted-foreground/50 bg-card"
          }`}
          onClick={() => setPaymentMethod("chargily")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "chargily"
                  ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400"
                  : "border-muted-foreground/50"
              }`}
            >
              {paymentMethod === "chargily" && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                شارجيلي - Chargily
              </div>
              <div className="text-sm text-muted-foreground">
                دفع آمن بالبطاقة البنكية
              </div>
            </div>
          </div>
        </div>
      )}

      {/* P2P Payment Method */}
      {hasP2P && (
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            paymentMethod === "p2p"
              ? "border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-400"
              : "border-border hover:border-muted-foreground/50 bg-card"
          }`}
          onClick={() => setPaymentMethod("p2p")}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "p2p"
                  ? "border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400"
                  : "border-muted-foreground/50"
              }`}
            >
              {paymentMethod === "p2p" && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                التحويل المباشر - P2P
              </div>
              <div className="text-sm text-muted-foreground">
                تحويل مباشر عبر الهاتف المحمول
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for no active methods */}
      {!hasChargily && !hasP2P && (
        <div className="col-span-2 text-center py-8">
          <div className="text-muted-foreground">
            لا توجد طرق دفع نشطة متاحة حالياً
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            تم العثور على {activeConnections.length} اتصال(ات) ولكن لا يوجد منها
            نشط
          </div>
        </div>
      )}
    </div>
  );
}
