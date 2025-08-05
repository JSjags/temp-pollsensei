"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle } from "lucide-react";

interface Field {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
}

interface FieldBadgeProps {
  field: Field;
  isSelected: boolean;
  onToggle: (fieldId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const FieldBadge: React.FC<FieldBadgeProps> = ({
  field,
  isSelected,
  onToggle,
  isLoading = false,
  className = "",
}) => {
  const validateFieldData = () => {
    if (!field) {
      return { isValid: false, error: "Missing field data" };
    }

    if (!field._id) {
      return { isValid: false, error: "Missing field._id" };
    }

    if (!/^[0-9a-fA-F]{24}$/.test(field._id)) {
      console.error(
        "❌ FieldBadge: field._id is not a valid ObjectId:",
        field._id
      );
      return { isValid: false, error: `Invalid ObjectId: ${field._id}` };
    }

    // if (!field.name) {
    //   console.warn("⚠️ FieldBadge: field.name is missing for field:", field);
    // }

    return { isValid: true, error: null };
  };

  const validation = validateFieldData();

  const handleClick = () => {
    if (isLoading) {
      console.log("⏳ FieldBadge: Ignoring click - still loading");
      return;
    }
    onToggle(field._id); 
  };

  if (isLoading) {
    return <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-full" />;
  }

  if (!validation.isValid) {
    return (
      <Badge
        variant="outline"
        className="px-4 py-2 text-sm rounded-full border-red-300 bg-red-50 text-red-700 cursor-not-allowed opacity-75"
        title={`Invalid field: ${validation.error}`}
      >
        <AlertTriangle className="w-3 h-3 mr-2" />
        <span className="line-through">{field.name || "Invalid Field"}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={`
        px-4 py-2 text-sm cursor-pointer transition-all duration-200 
        hover:scale-105 hover:shadow-md rounded-full
        ${
          isSelected
            ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
            : "bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:text-purple-600"
        }
        ${className}
      `}
      onClick={handleClick}
      title={`${field.name} (ID: ${field._id})`}
    >
      <span className="flex items-center gap-2">
        {isSelected && <Check className="w-3 h-3" />}
        {field.name}
      </span>
    </Badge>
  );
};

export default FieldBadge;
