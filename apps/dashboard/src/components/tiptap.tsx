"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold } from "lucide-react";
import { Toggle } from "@ui/components/ui/toggle";
import { Separator } from "@ui/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Italic } from "lucide-react";
const ToolBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="w-[500px] h-[50px]  flex-wrap   flex items-center justify-start gap-x-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="الفقرة" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>أنماط الخطوط</SelectLabel>
            <SelectItem value="apple">الفقرة</SelectItem>
            <SelectItem value="banana">عنوان</SelectItem>
            <SelectItem value="blueberry">العنوان الفرعي</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className=" w-4 h-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className=" w-4 h-4" />
      </Toggle>
    </div>
  );
};

const Tiptap = ({
  description,
  onChnage,
}: {
  description: string;
  onChnage: (richTeact: any) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: description,
    editorProps: {
      attributes: {
        class: " min-h-[150px] p-2  ",
      },
    },
    onUpdate({ editor }) {
      onChnage(editor.getJSON());
      console.log(editor.getJSON());
    },
  });

  return (
    <div className="flex flex-col border  rounded-md  bg-white justify-stretch min-h-[250px] p-4 ">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
