import { useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import VedioUploader from "../uploaders/VedioUploader";

interface addVedioProps {}

const AddVedio: FC = ({}) => {
  const [videoId, setVideoId] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>إضافة فيديو جديد إلى المكتبة</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <VedioUploader onChange={(val) => setVideoId(val)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddVedio;
