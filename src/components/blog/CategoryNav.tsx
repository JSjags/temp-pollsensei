"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoCompassOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

interface CategoryNavProps {
  categories: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const CategoryNav: FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    if (!user) {
      router.push("/login");
    }

    if (onCategorySelect) {
      onCategorySelect(category.toLowerCase().replace(" ", "-"));
    }
  };

  return (
    <nav className="bg-white w-full py-3 overflow-x-auto scrollbar-hide">
      <div className="w-full mx-auto">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              variant="default"
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "text-xs font-medium whitespace-nowrap transition-colors rounded-full bg-[#EEEFF0] text-[#333333] flex items-center gap-1 px-4 py-[2px] hover:bg-purple-600 hover:text-white",
                selectedCategory === category.toLowerCase().replace(" ", "-") &&
                  "bg-purple-600 text-white"
              )}
            >
              {category === "Explore All" && (
                <IoCompassOutline className="text-lg" />
              )}
              {category}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
