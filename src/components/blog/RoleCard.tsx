"use client";
import React, { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  label: string;
  icon: string;
}

interface RoleCardProps {
  role: Role;
  isSelected: boolean;
  onSelect: (roleId: string) => void;
}

const RoleCard: FC<RoleCardProps> = ({ role, isSelected, onSelect }) => {
  const getPurpleFilter = () => {
    return "invert(48%) sepia(79%) saturate(2476%) hue-rotate(249deg) brightness(97%) contrast(97%)";
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg relative group",
        isSelected
          ? "border-purple-600 border-2 bg-purple-50"
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={() => onSelect(role.id)}
    >
      <CardContent className="p-6 text-center flex flex-col items-center justify-center">
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center animate-in fade-in-0 zoom-in-50 duration-200">
            <span className="text-white text-xs">✓</span>
          </div>
        )}

        <div className="relative w-[100px] h-[100px] mb-4 flex items-center justify-center">
          <Image
            src={role.icon}
            alt={role.label}
            width={100}
            height={100}
            className={cn(
              "object-contain transition-all duration-300 ease-in-out",
              !isSelected && "group-hover:brightness-110"
            )}
            style={{
              filter: isSelected ? getPurpleFilter() : undefined,
            }}
          />
        </div>

        <h3
          className={cn(
            "font-semibold transition-colors duration-300",
            isSelected
              ? "text-purple-600"
              : "text-gray-700 group-hover:text-gray-900"
          )}
        >
          {role.label}
        </h3>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
