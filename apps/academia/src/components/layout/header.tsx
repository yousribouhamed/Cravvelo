import MaxWidthWrapper from "../max-with-wrapper";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <div className="w-full h-[70px] bg-white border-b dark:bg-zinc-900">
      <MaxWidthWrapper className="h-full">
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <h1>logo</h1>
          </div>

          <div className="flex items-center justify-end gap-x-4">
            <Button>sing in</Button>
            <Button>sing up</Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
