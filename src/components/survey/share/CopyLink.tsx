import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyLinkProps } from "./types";

export function CopyLink({ value, isLoading }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-11 w-full" />;
  }

  return (
    <div className="w-full flex border rounded-lg overflow-hidden hover:border-purple-300 transition-colors">
      <input
        type="text"
        value={value}
        readOnly
        className="p-3 border-0 ring-0 w-3/4 bg-gray-50"
      />
      <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
        <button
          className={`w-1/4 font-medium text-sm transition-colors ${
            copied
              ? "bg-green-50 text-green-600"
              : "bg-purple-50 text-purple-600 hover:bg-purple-100"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </CopyToClipboard>
    </div>
  );
}
