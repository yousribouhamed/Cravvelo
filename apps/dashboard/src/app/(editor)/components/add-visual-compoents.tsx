// "use client";

// import { useState, type FC } from "react";
// import { Sheet, SheetContent } from "@ui/components/ui/sheet";

// import { Button } from "@ui/components/ui/button";
// import { ScrollArea } from "@ui/components/ui/scroll-area";

// // import { getVirtualComponent } from "@/src/constants/website-template";

// interface AddVisualCompoentsAbdullahProps {}

// const VisualComponents = {
//   typography: [
//     {
//       name: "",
//       type: "TEXT",
//       imageUrl: "",
//     },
//     {
//       name: "",
//       type: "TITLEANDTEXT",
//       imageUrl: "",
//     },
//   ],

//   sections: [],
//   navigation: [],
//   media: [],
//   interactive: [],
// };

// interface Props {
//   page: WebSitePage;
//   setPages: React.Dispatch<React.SetStateAction<WebSitePage>>;
// }

// const AddVisualCompoents: FC<Props> = ({ page, setPages }) => {
//   const { isOpen, setIsOpen } = openAddVirtualCompoent();
//   const [section, setSection] = useState("typography");
//   const handleSelection = ({ type }: { type: string }) => {
//     // setPages({
//     //   ...page,
//     //   components: [
//     //     ...page.components,
//     //     getVirtualComponent({ type }) as ComponentBuilder,
//     //   ],
//     // });
//   };

//   return (
//     <Sheet open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
//       <SheetContent className="w-[800px] pt-12" side="right">
//         <div className="w-full  h-full grid grid-cols-3 gap-6">
//           <div className="col-span-1   h-full w-full flex flex-col  dark:border-gray-700 items-start gap-y-6 ">
//             <Button
//               variant="ghost"
//               className="h-14 w-full rounded-2xl dark:bg-white/5 flex justify-start gap-x-4 font-semibold text-lg hover:text-white  "
//             >
//               الطباعة
//             </Button>
//             <Button
//               variant="ghost"
//               className="h-14 w-full rounded-2xl dark:bg-white/5 flex justify-start gap-x-4 font-semibold text-lg hover:text-white  "
//             >
//               أقسام
//             </Button>
//             <Button
//               variant="ghost"
//               className="h-14 w-full rounded-2xl dark:bg-white/5 flex justify-start gap-x-4 font-semibold text-lg hover:text-white  "
//             >
//               ملاحة
//             </Button>
//             <Button
//               variant="ghost"
//               className="h-14 w-full  rounded-2xl dark:bg-white/5 flex justify-start gap-x-4 font-semibold text-lg hover:text-white  "
//             >
//               الإعلام
//             </Button>
//             <Button
//               variant="ghost"
//               className="h-14 w-full rounded-2xl dark:bg-white/5 flex justify-start gap-x-4 font-semibold text-lg hover:text-white  "
//             >
//               تفاعلية
//             </Button>
//           </div>

//           <div className="col-span-2  h-full w-full  ">
//             <ScrollArea className="w-full h-fit flex flex-col items-end  p-4">
//               {VisualComponents[section].map((item, index) => {
//                 return (
//                   <div
//                     key={item?.type + index}
//                     className="w-[90%] my-4 h-[200px] relative rounded-2xl group bg-white/10"
//                   >
//                     <Button
//                       onClick={() => handleSelection({ type: item?.type })}
//                       className="absolute inset-0 m-auto w-fit hidden group-hover:flex  rounded-2xl hover:-translate-y-1 duration-150 transition-all"
//                     >
//                       أضف هذا العنصر
//                     </Button>
//                   </div>
//                 );
//               })}
//             </ScrollArea>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default AddVisualCompoents;

import type { FC } from "react";

const addVisualCompoents: FC = ({}) => {
  return <div>add-visual-compoents</div>;
};

export default addVisualCompoents;
