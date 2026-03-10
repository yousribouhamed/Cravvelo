"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateUserSubscription } from "../actions/subscription.actions";

const PLANS = [
  { value: "BASIC", label: "Basic" },
  { value: "STARTER", label: "Starter" },
  { value: "GROWTH", label: "Growth" },
  { value: "SCALE", label: "Scale" },
] as const;

const BILLING = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
] as const;

interface ChangePlanModalProps {
  accountId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePlanModal({
  accountId,
  onClose,
  onSuccess,
}: ChangePlanModalProps) {
  const [planCode, setPlanCode] = useState<string>("STARTER");
  const [billingCycle, setBillingCycle] = useState<string>("MONTHLY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!accountId) return;
    setError(null);
    setLoading(true);
    try {
      const res = await updateUserSubscription({
        accountId,
        planCode: planCode as "BASIC" | "STARTER" | "GROWTH" | "SCALE",
        billingCycle: billingCycle as "MONTHLY" | "YEARLY",
      });
      const payload = res.data as { success?: boolean; error?: string } | undefined;
      if (res.success && payload?.success !== false) {
        onSuccess();
      } else {
        setError(payload?.error ?? res.error ?? "Failed to update subscription");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [accountId, planCode, billingCycle, onSuccess]);

  const open = !!accountId;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-white border-zinc-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Change subscription plan</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Update the user&apos;s subscription plan and billing cycle.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="plan" className="text-zinc-700">
              Plan
            </Label>
            <Select value={planCode} onValueChange={setPlanCode}>
              <SelectTrigger id="plan" className="border-zinc-300 bg-white text-zinc-900">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {PLANS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="billing" className="text-zinc-700">
              Billing cycle
            </Label>
            <Select value={billingCycle} onValueChange={setBillingCycle}>
              <SelectTrigger id="billing" className="border-zinc-300 bg-white text-zinc-900">
                <SelectValue placeholder="Select billing" />
              </SelectTrigger>
              <SelectContent>
                {BILLING.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {loading ? "Updating…" : "Update plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
