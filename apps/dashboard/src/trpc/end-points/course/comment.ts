// createModule: privateProcedure
//   .input(
//     z.object({
//       chapterID: z.string(),
//       title: z.string(),
//       content: z.any(),
//       length: z.number(),
//       fileUrl: z.string(),
//       fileType: z.string(),
//     })
//   )
//   .mutation(async ({ input, ctx }) => {
//     const videoLength = await getVideoLength(
//       process.env["NEXT_PUBLIC_VIDEO_LIBRARY"],
//       input.fileUrl,
//       process.env["NEXT_PUBLIC_BUNNY_API_KEY"]
//     );

//     console.log("this is the input we are passing");
//     console.log({
//       chapterID: input.chapterID,
//       title: input.title,
//       content: input.content,
//       length: input.length,
//     });

//     // first we need to get all the modules
//     const chapter = await ctx.prisma.chapter.findFirst({
//       where: { id: input.chapterID },
//     });

//     if (!chapter) {
//       throw new TRPCError({
//         code: "NOT_FOUND",
//         message: "Chapter not found",
//       });
//     }

//     const modules = chapter?.modules
//       ? (JSON.parse(chapter?.modules as string) as Module[])
//       : ([] as Module[]);

//     // Generate unique ID for the new module
//     const moduleId = `module_${Date.now()}_${modules.length}`;

//     // second we need to update the array
//     const newModule = {
//       id: moduleId,
//       content: input.content,
//       length: videoLength,
//       duration: videoLength, // Add duration for frontend compatibility
//       fileType: input.fileType,
//       fileUrl: input.fileUrl,
//       orderNumber: modules.length + 1,
//       position: modules.length,
//       title: input.title,
//       isPublished: true,
//       isFree: false,
//       type: input.fileType,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     const newModules = [...modules, newModule];

//     // then store it back in the database
//     const course = await ctx.prisma.chapter
//       .update({
//         data: {
//           modules: JSON.stringify(newModules),
//         },
//         where: {
//           id: input.chapterID,
//         },
//       })
//       .catch((err) => {
//         console.error(err);
//         throw new TRPCError({ code: "NOT_FOUND" });
//       });

//     const courseOldData = await ctx.prisma.course.findFirst({
//       where: {
//         id: chapter.courseId,
//       },
//     });

//     if (courseOldData) {
//       await ctx.prisma.course.update({
//         where: {
//           id: chapter.courseId,
//         },
//         data: {
//           length: videoLength + courseOldData.length,
//           nbrChapters: 1 + courseOldData.nbrChapters,
//         },
//       });
//     }

//     return { success: true, courseId: course.id, moduleId };
//   }),

// updateMaterial: privateProcedure
//   .input(
//     z.object({
//       oldFileUrl: z.string(),
//       chapterID: z.string(),
//       title: z.string(),
//       content: z.any(),
//       fileUrl: z.string(),
//     })
//   )
//   .mutation(async ({ input, ctx }) => {
//     try {
//       const videoLength = await getVideoLength(
//         process.env["NEXT_PUBLIC_VIDEO_LIBRARY"],
//         input.fileUrl,
//         process.env["NEXT_PUBLIC_BUNNY_API_KEY"]
//       );

//       const targetChapter = await ctx.prisma.chapter.findFirst({
//         where: {
//           id: input.chapterID,
//         },
//       });

//       if (!targetChapter || !targetChapter.modules) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Chapter or modules not found",
//         });
//       }

//       const oldMaterials = JSON.parse(
//         targetChapter.modules as string
//       ) as Module[];

//       // find the target
//       const targetMaterial = oldMaterials.find(
//         (item) => item.fileUrl === input.oldFileUrl
//       );

//       if (!targetMaterial) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Module not found",
//         });
//       }

//       // create new material
//       const newMaterial = {
//         ...targetMaterial,
//         content: input.content,
//         fileUrl: input.fileUrl,
//         title: input.title,
//         length: videoLength,
//         duration: videoLength,
//         updatedAt: new Date().toISOString(),
//       } as Module;

//       const newMaterials = oldMaterials.map((item) =>
//         item.fileUrl === targetMaterial.fileUrl ? newMaterial : item
//       );

//       const newChapter = await ctx.prisma.chapter.update({
//         where: {
//           id: input.chapterID,
//         },
//         data: {
//           modules: JSON.stringify(newMaterials),
//         },
//       });

//       return newChapter;
//     } catch (err) {
//       console.error("Error updating material:", err);
//       throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
//     }
//   }),
