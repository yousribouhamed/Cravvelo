import BrandButton from "@/components/brand-button";
import Image from "next/image";

export default function EmptyState() {
  return (
    <div className="w-full h-full bg-card flex flex-col gap-y-4 justify-center items-center">
      <img src={"/empty-box.svg"} alt={"empty money"} />

      <BrandButton>join program</BrandButton>
    </div>
  );
}
