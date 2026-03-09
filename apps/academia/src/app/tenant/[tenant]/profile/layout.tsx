import React from "react";
import ProfileLayoutClient from "./profile-layout-client";

export default function ProfileLayout({ children }: React.PropsWithChildren) {
  return <ProfileLayoutClient>{children}</ProfileLayoutClient>;
}
