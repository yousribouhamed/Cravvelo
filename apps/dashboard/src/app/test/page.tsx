import { type FC } from "react";
import { Button } from "@ui/components/ui/button";
import { maketoast } from "@/src/components/toasts";
import { notifyUser } from "@/src/actions/notifications.actions";
import { pusherServer } from "@/src/lib/pusher";

const page: FC = ({}) => {
  pusherServer.trigger("secretId", "incomming-notifications", {
    name: "abdullah",
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Button onClick={notifyUser}>notify user</Button>
    </div>
  );
};

export default page;
