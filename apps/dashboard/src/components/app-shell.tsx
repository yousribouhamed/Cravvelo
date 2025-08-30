import { ReactNode } from "react";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";

interface Props {
  children: ReactNode;
  user: any;
  notifications: any;
  title?: string;
}

export default function AppShell({
  children,
  notifications,
  user,
  title,
}: Props) {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={title ?? "no header "}
        />
        {children}
      </main>
    </MaxWidthWrapper>
  );
}
