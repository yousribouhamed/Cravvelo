// import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// const auth = async () => {
//   const user = await currentUser();
//   return user;
// };

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    // .middleware(async ({ req }) => {
    //   const user = await auth();
    //   if (!user) throw new Error("Unauthorized");
    //   return { userId: user.id };
    // })
    .onUploadComplete(async ({ file }) => {
      // here i need to save the file to the currect module
      return {
        file,
      };
    }),
  imageUploader: f({ pdf: { maxFileSize: "1024MB" } })
    // .middleware(async ({ req }) => {
    //   const user = await auth();
    //   if (!user) throw new Error("Unauthorized");
    //   return { userId: user.id };
    // })
    .onUploadComplete(async ({ file }) => {
      // here i need to save the file to the currect module
      return {
        file,
      };
    }),
  voiceUploader: f({ audio: { maxFileSize: "1024GB" } })
    // .middleware(async ({ req }) => {
    //   const user = await auth();
    //   if (!user) throw new Error("Unauthorized");
    //   return { userId: user.id };
    // })
    .onUploadComplete(async ({ file }) => {
      // here i need to save the file to the currect module
      return {
        file,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
