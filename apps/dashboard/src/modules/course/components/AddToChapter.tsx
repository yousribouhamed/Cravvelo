import { Video, FileText, Mic, Calendar, AlignLeft, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@ui/lib/utils";

const getValueFromUrl = (path: string, index: number): string => {
  return path.split("/")[index];
};

export const AddToChapter = ({
  path,
  chapterID,
}: {
  path: string;
  chapterID: string;
}) => {
  const courseId = getValueFromUrl(path, 2);

  const contentTypes = [
    {
      name: "فيديو",
      description: "إضافة فيديو تعليمي",
      url: `/courses/${courseId}/chapters/${chapterID}/add-video`,
      icon: Video,
      disabled: false,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    // {
    //   name: "ملف PDF",
    //   description: "رفع ملف PDF",
    //   url: `/courses/${courseId}/chapters/${chapterID}/add-pdf`,
    //   icon: FileText,
    //   disabled: true,
    //   color: "text-red-600",
    //   bgColor: "bg-red-50",
    // },
    // {
    //   name: "صوت",
    //   description: "إضافة ملف صوتي",
    //   url: `/courses/${courseId}/chapters/${chapterID}/add-voice`,
    //   icon: Mic,
    //   disabled: true,
    //   color: "text-green-600",
    //   bgColor: "bg-green-50",
    // },
    // {
    //   name: "فصل افتراضي",
    //   description: "جلسة تعليمية مباشرة",
    //   url: `/courses/${courseId}/chapters/${chapterID}/add-virtual-class`,
    //   icon: Calendar,
    //   disabled: true,
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-50",
    // },
    // {
    //   name: "نص",
    //   description: "إضافة محتوى نصي",
    //   url: `/courses/${courseId}/chapters/${chapterID}/add-text`,
    //   icon: AlignLeft,
    //   disabled: false,
    //   color: "text-orange-600",
    //   bgColor: "bg-orange-50",
    // },
  ];

  return (
    <div className="w-full min-h-[120px] h-fit pb-6 border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors bg-white rounded-xl mx-auto p-4 md:p-8 shadow-sm">
      {/* Header */}
      <div className="w-full flex items-center justify-start gap-x-4 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ">
          <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-start font-bold text-lg md:text-xl text-gray-900">
            أضف مواد تعليمية جديدة إلى القسم
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            اختر نوع المحتوى الذي تريد إضافته للقسم
          </p>
        </div>
      </div>

      {/* Content Types Grid */}
      <div className="w-full overflow-x-auto">
        <div className="flex items-stretch justify-start gap-4 min-w-max pb-2">
          {contentTypes.map((item) => {
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                prefetch={false}
                className={cn(
                  "group relative flex flex-col items-center justify-center p-4 min-w-[140px] h-[120px] rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                  item.disabled
                    ? "cursor-not-allowed bg-gray-50 border-gray-200"
                    : `cursor-pointer bg-white border-gray-200 hover:border-primary  ${item.bgColor}/20 hover:${item.bgColor}/30`
                )}
                href={item.disabled ? "#" : item.url}
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
              >
                {/* Icon Container */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                    item.disabled ? "bg-gray-200" : `${item.bgColor} `
                  )}
                >
                  <IconComponent
                    className={cn(
                      "w-6 h-6 transition-colors",
                      item.disabled ? "text-gray-400" : item.color
                    )}
                    strokeWidth={2}
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h4
                    className={cn(
                      "font-semibold text-sm mb-1",
                      item.disabled ? "text-gray-400" : "text-gray-900"
                    )}
                  >
                    {item.name}
                  </h4>
                  <p
                    className={cn(
                      "text-xs leading-relaxed",
                      item.disabled ? "text-gray-300" : "text-gray-500"
                    )}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                {!item.disabled && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          يمكنك إضافة عدة أنواع من المحتوى لإثراء التجربة التعليمية
        </p>
      </div>
    </div>
  );
};
