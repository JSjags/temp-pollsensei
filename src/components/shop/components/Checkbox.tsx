import React from "react";
import * as CheckboxPrimiteve from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Check } from "@/assets/images";
import Image from "next/image";

type CheckboxElement = React.ElementRef<typeof CheckboxPrimiteve.Root>;
type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimiteve.Root
>;
export const Checkbox = React.forwardRef<CheckboxElement, CheckboxProps>(
  (props, ref) => {
    const { className, disabled, ...checkboxProps } = props;
    return (
      <CheckboxPrimiteve.Root
        className={cn(
          "flex size-6 items-center justify-center rounded-full border-2 border-[#5B03B2]",
          "data-[state=checked]:bg-[#5B03B2] data-[state=checked]:border-transparent",
          "disabled:opacity-25",
          className
        )}
        defaultChecked
        ref={ref}
        {...checkboxProps}
        disabled={disabled}
      >
        <CheckboxPrimiteve.Indicator>
          <Image src={Check} alt="checkmark" />
        </CheckboxPrimiteve.Indicator>
      </CheckboxPrimiteve.Root>
    );
  }
);
Checkbox.displayName = "Checkbox";
