"use client";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <>
      <div className={`pb-12  bg-black h-full    hidden   ${className} `}>
        <div className="space-y-4 py-2   ">
          <div className="px-3 pb-2 pt-6"></div>
        </div>
      </div>
    </>
  );
}
