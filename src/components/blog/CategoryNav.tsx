"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoCompassOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FilterType } from "@/app/(public)/blog/page";

interface CategoryNavProps {
  activeFilter: string | undefined;
  onFilterChange: (filter: FilterType) => void;
}

const CategoryNav: FC<CategoryNavProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const categories = [
    { id: "dashboard", label: "Explore All", icon: IoCompassOutline },
    { id: "category", label: "Category", icon: null },
    { id: "interest", label: "Interest", icon: null },
  ];

  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    if (!user && (categoryId === "category" || categoryId === "interest")) {
      router.push("/login");
      return;
    }

    const filterType: FilterType = categoryId as FilterType;
    onFilterChange(filterType);
  };

  return (
    <nav className="w-full py-3 overflow-x-auto scrollbar-hide">
      <div className="w-full mx-auto">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeFilter === category.id;
            const needsAuth =
              !user &&
              (category.id === "category" || category.id === "interest");

            return (
              <Button
                variant="default"
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "text-xs font-medium whitespace-nowrap transition-colors rounded-full flex items-center gap-1 px-4 py-[2px] relative",
                  isActive
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-[#EEEFF0] text-[#333333] hover:bg-purple-100",
                  needsAuth && "opacity-75"
                )}
              >
                {Icon && <Icon className="text-lg" />}
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
