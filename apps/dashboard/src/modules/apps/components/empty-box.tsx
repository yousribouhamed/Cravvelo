import Image from "next/image";

interface EmptyBoxProps {}

export default function EmptyBox() {
  return (
    <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
      <Image
        loading="eager"
        alt="لا توجد إشعارات"
        src="/empty-box.svg"
        width={150}
        height={150}
        className="dark:opacity-80"
      />
      <p className="text-md text-center text-muted-foreground">
        لا توجد تطبيقات للتثبيت
      </p>
    </div>
  );
}
