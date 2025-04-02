import React from "react";
import { Input } from "../ui/shadcn-input";

export type OtherValueProps = {
  description?: string;
  is_required?: boolean;
  options?: string[];
  other_value?: string;
  question?: string;
  question_type?: string;
  selected_options?: string[];
  validation_result?: {
    status: string;
  };
};

const OtherValue = (item: OtherValueProps) => {
  return (
    <div className="mt-2 mb-6">
      <Input
        type="text"
        value={item.other_value}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50"
      />
    </div>
  );
};

export default OtherValue;
