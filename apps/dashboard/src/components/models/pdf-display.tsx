import type { Dispatch, FC, SetStateAction } from "react";
import { Dialog, DialogContent } from "@ui/components/ui/dialog";
import PdfFullscreen from "../pdf-fullscreen";

interface pdfDisplayProps {
  fileUrl: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const PdfDisplayModal: FC<pdfDisplayProps> = ({
  fileUrl,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogContent title="عارض الملف">
        <PdfFullscreen fileUrl={fileUrl} />
      </DialogContent>
    </Dialog>
  );
};

export default PdfDisplayModal;
