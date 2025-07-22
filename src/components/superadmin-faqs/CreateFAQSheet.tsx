import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import validate from "validate.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Form, Field } from "react-final-form";
import { Input } from "../ui/shadcn-input";
import { ClipLoader } from "react-spinners";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextToolbar from "./RichTextToolbar";

const editorStyles = {
  minHeight: "150px",
  height: "100%",
  outline: "none",
  padding: "0.5rem",
} as const;

interface CreateFAQSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { question: string; answer: string }) => Promise<void>;
  isLoading: boolean;
  variant?: "default" | "small";
}

const constraints = {
  question: { presence: true },
  answer: { presence: true, length: { minimum: 1 } },
};

export const CreateFAQSheet: React.FC<CreateFAQSheetProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  variant = "default",
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      if (formRef.current) {
        formRef.current.change("answer", editor.getHTML());
      }
    },
  });

  const formRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  useEffect(() => {
    if (!isOpen) {
      editor?.commands.setContent("");
    }
  }, [isOpen, editor]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          className={cn(
            "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white",
            "hover:opacity-90 transition-all duration-300",
            variant === "small" ? "px-3 py-1.5 text-sm" : "px-4 py-2"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create FAQ
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-800">
            Create New FAQ
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Form
            onSubmit={onSubmit}
            validate={(values) => validate(values, constraints) || {}}
            render={({ handleSubmit, submitting, form }) => {
              formRef.current = form;

              return (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const result = await handleSubmit(e);
                    if (result) {
                      onOpenChange(false);
                    }
                  }}
                  className="space-y-6"
                >
                  <Field name="question">
                    {({ input }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Question</label>
                        <Input
                          {...input}
                          placeholder="Enter your question here"
                          className="w-full"
                        />
                      </div>
                    )}
                  </Field>

                  <Field name="answer">
                    {({ input }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Answer</label>
                        <div className="border rounded-md overflow-hidden bg-white">
                          <RichTextToolbar editor={editor} />
                          <div
                            className="min-h-[150px] cursor-text"
                            onClick={() => editor?.chain().focus().run()}
                          >
                            <EditorContent
                              editor={editor}
                              className="prose prose-sm max-w-none focus:outline-none ProseMirror"
                              style={editorStyles}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>

                  <SheetFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || isLoading}
                      className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
                    >
                      {submitting || isLoading ? (
                        <ClipLoader size={20} color="#ffffff" />
                      ) : (
                        "Save FAQ"
                      )}
                    </Button>
                  </SheetFooter>
                </form>
              );
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
