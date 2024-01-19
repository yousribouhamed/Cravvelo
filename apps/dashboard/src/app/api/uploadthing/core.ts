import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = async () => {
  const user = await currentUser();
  return user;
};

export const ourFileRouter = {
  pdfUploader: f({ image: { maxFileSize: "32MB" } })
    .middleware(async ({ req }) => {
      const user = await auth();
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // here i need to save the file to the currect module
      return {
        uploadedBy: metadata.userId,
        file,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
