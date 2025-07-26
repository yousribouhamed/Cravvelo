import { ReactNode } from "react";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";

interface Props {
  children: ReactNode;
  user: any;
  notifications: any;
}

export default function AppShell({ children, notifications, user }: Props) {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="الدورات التدريبية"
        />
        {children}
      </main>
    </MaxWidthWrapper>
  );
}
