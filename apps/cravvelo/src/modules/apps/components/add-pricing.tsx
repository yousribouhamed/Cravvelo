"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { setAppPricing } from "../actions/app-pricing.actions";
import { Plus } from "lucide-react";

interface AddPricingSheetProps {
  appId: string;
  trigger?: React.ReactNode;
  refetch: () => Promise<any>;
}

export default function AddAppPricingSheet({
  appId,
  trigger,
  refetch,
}: AddPricingSheetProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    currency: "DZD",
    recurringDays: 30,
    freeTrialDays: 0,
    isDefault: true,
    accountId: "", // You might need to get this from context/props
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => setAppPricing({ ...data, appId }),
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Pricing Plan
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Pricing Plan</SheetTitle>
          <SheetDescription>
            Create a new pricing plan for your application.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6 px-4">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Basic Plan, Premium Plan"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this plan includes..."
              rows={3}
            />
          </div>

          {/* Price and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                placeholder="DZD"
              />
            </div>
          </div>

          {/* Recurring Days */}
          <div className="space-y-2">
            <Label htmlFor="recurringDays">Billing Cycle (Days)</Label>
            <Input
              id="recurringDays"
              type="number"
              min="1"
              value={formData.recurringDays}
              onChange={(e) =>
                handleInputChange(
                  "recurringDays",
                  parseInt(e.target.value) || 30
                )
              }
              required
            />
          </div>

          {/* Free Trial Days */}
          <div className="space-y-2">
            <Label htmlFor="freeTrialDays">Free Trial (Days)</Label>
            <Input
              id="freeTrialDays"
              type="number"
              min="0"
              value={formData.freeTrialDays}
              onChange={(e) =>
                handleInputChange(
                  "freeTrialDays",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>

          {/* Is Default Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                handleInputChange("isDefault", checked)
              }
            />
            <Label htmlFor="isDefault">Make this the default plan</Label>
          </div>

          {/* Error Message */}
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {mutation.error?.message ||
                  "An error occurred while creating the pricing plan"}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {mutation.isSuccess && (
            <Alert>
              <AlertDescription>
                Pricing plan created successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Creating..." : "Create Pricing Plan"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
