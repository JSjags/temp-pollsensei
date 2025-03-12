import React from "react";
import * as CheckboxPrimiteve from "@radix-ui/react-checkbox";
import Check from "@/assets/images/shop/check.svg";
import { cn } from "@/lib/utils";

type CheckboxElement = React.ElementRef<typeof CheckboxPrimiteve.Root>;
type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimiteve.Root
>;
export const Checkbox = React.forwardRef<CheckboxElement, CheckboxProps>(
  (props, ref) => {
    const { className, ...checkboxProps } = props;
    return (
      <CheckboxPrimiteve.Root
        className={cn(
          "flex size-6 items-center justify-center rounded-full border border-[#5B03B2]",
          "data-[state=checked]:bg-[#5B03B2] data-[state=checked]:border-transparent",
          className
        )}
        defaultChecked
        ref={ref}
        {...checkboxProps}
      >
        <CheckboxPrimiteve.Indicator>
          <Check className="size-2.5" />
        </CheckboxPrimiteve.Indicator>
      </CheckboxPrimiteve.Root>
    );
  }
);
Checkbox.displayName = "Checkbox";
