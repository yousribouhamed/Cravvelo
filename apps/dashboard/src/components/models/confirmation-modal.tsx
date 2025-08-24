import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";
import { useConfirmationContext } from "@/src/contexts/confirmation-context";

export const ConfirmationModal: React.FC = () => {
  const { isOpen, config, closeConfirmation, handleConfirm } =
    useConfirmationContext();

  const getIcon = () => {
    switch (config.variant) {
      case "destructive":
        return <AlertTriangle className="h-6 w-6 text-destructive" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => closeConfirmation()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle className="text-lg font-semibold">
              {config.title || "Are you absolutely sure?"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {config.description || "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <Button
            variant="outline"
            onClick={closeConfirmation}
            className="w-full sm:w-auto"
          >
            {config.cancelText || "Cancel"}
          </Button>
          <Button
            variant={
              config.variant === "destructive" ? "destructive" : "default"
            }
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {config.confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
