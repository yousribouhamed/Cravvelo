import { toast } from "@ui/lib/utils";
import { AlertTriangle, Bone, Book, Check, Info, X } from "lucide-react";

type Ttoasts = "SUCCESS" | "ERROR" | "INFO" | "WARNNING";

export const academiatoast = {
  make: ({
    color,
    message,
    type,

    title,
  }: {
    color: string;
    message: string;
    type: Ttoasts;
    title: string;
  }) =>
    toast.custom(
      (t) => (
        <div className="w-[380px] h-[90px] rounded-2xl bg-white shadow-2xl border flex items-center px-4 ">
          <div className="w-10 h-10 rounded-[50%] bg-white  flex items-center justify-center ">
            {type === "SUCCESS" ? (
              <Check
                className="w-6 h-6 "
                style={{
                  backgroundColor: color,
                }}
              />
            ) : type === "ERROR" ? (
              <AlertTriangle
                className="w-6 h-6 "
                style={{
                  backgroundColor: color,
                }}
              />
            ) : type === "WARNNING" ? (
              <AlertTriangle
                className="w-6 h-6 "
                style={{
                  backgroundColor: color,
                }}
              />
            ) : (
              <Book
                className="w-6 h-6 "
                style={{
                  backgroundColor: color,
                }}
              />
            )}
          </div>
          <div className="w-[80%] flex flex-col justify-start  items-start p-2">
            <span className="text-xl font-bold text-white ">{title}</span>
            <span className="text-white text-xl text-start">{message}</span>
          </div>
          <X
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer text-black "
          />
        </div>
      ),
      {
        position: "top-left",
      }
    ),
};
