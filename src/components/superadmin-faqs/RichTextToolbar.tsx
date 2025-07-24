import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "../ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface RichTextToolbarProps {
  editor: Editor | null;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-1 border-b">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-muted" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-muted" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RichTextToolbar;
