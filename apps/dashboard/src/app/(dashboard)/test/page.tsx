"use client";

import { maketoast } from "@/src/components/toasts";
import { Button } from "@ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";

import { Input } from "@ui/components/ui/input";
import { Textarea } from "@ui/components/ui/textarea";

import type { FC } from "react";
import Tiptap from "@/src/components/tiptap";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen bg-gray-50 flex items-center justify-center gap-8 flex-wrap ">
      <Input className="w-[180px]" placeholder="اختر المدرب" />

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="اختر المدرب" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <Textarea rows={3} placeholder="اختر المدرب" />

      <Tiptap description="oiii" onChnage={(val) => console.log(val)} />
    </div>
  );
};

export default page;
