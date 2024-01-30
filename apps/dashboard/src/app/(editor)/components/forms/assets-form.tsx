"use client";

import { useState, type FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { trpc } from "@/src/app/_trpc/client";
import { WebsiteAssets } from "@/src/types";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import { FolderPlus } from "lucide-react";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

interface assetsFormAbdullahProps {}

const AssetsForm: FC = ({}) => {
  const [websiteAssets, setWebSiteAssets] = useState<WebsiteAssets>();

  const { data, refetch } = trpc.getWebsiteAssets.useQuery();

  return (
    <Card className="w-full min-h-[400px]  h-fit  rounded-2xl col-span-2">
      <CardHeader>
        <CardTitle>الصور المستخدمة في الموقع</CardTitle>
        <CardContent className="w-full h-fit min-h-[100px] flex flex-wrap gap-4 justify-start">
          {data ? (
            <>
              {data?.map((item, index) => (
                <div
                  key={item.name + index}
                  className="w-[100px] h-[100px] rounded-2xl flex items-center justify-center relative"
                >
                  <img
                    src={item.fileUrl}
                    alt={item.name}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </>
          ) : null}
          <AddAssets refetch={refetch} />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default AssetsForm;

interface PopUpProps {
  refetch: () => Promise<any>;
}

export function AddAssets({ refetch }: PopUpProps) {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  const mutation = trpc.addWebSiteAssets.useMutation({
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
    onError: () => {
      setOpen(false);
    },
  });

  const handleSublit = () => {
    mutation.mutate({
      fileUrl,
      name,
    });
  };
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <Button className="w-[100px] h-[100px] flex items-center justify-center rounded-2xl">
          <FolderPlus className="text-white w-8 h-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" title="إضافة صورة خارجية">
        <div className="grid gap-4 py-4 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              اسم الملف
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              رابط الملف
            </Label>
            <Input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              id="fileUrl"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="p-4">
          <Button
            onClick={handleSublit}
            className=" flex items-center gap-x-2"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
