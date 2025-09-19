"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

interface MultiSelectComboboxProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  loading = false,
  className,
  style,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [preventClose, setPreventClose] = React.useState(false);

  const handleSelect = (optionValue: string) => {
    // Prevent the popover from closing
    setPreventClose(true);

    if (optionValue === "select-all") {
      // Toggle select all
      const allValues = options.map((option) => option.value);
      const isAllSelected = allValues.every((val) => value.includes(val));

      if (isAllSelected) {
        // Deselect all
        onChange([]);
      } else {
        // Select all
        onChange(allValues);
      }
    } else if (optionValue === "clear-all") {
      // Clear all selections
      onChange([]);
    } else {
      // Regular selection
      const newValue = value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    }

    // Reset prevent close after a short delay
    setTimeout(() => setPreventClose(false), 100);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!preventClose) {
      setOpen(newOpen);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((item) => item !== optionValue));
  };

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const allValues = options.map((option) => option.value);
  const isAllSelected =
    allValues.length > 0 && allValues.every((val) => value.includes(val));
  const isPartiallySelected =
    value.length > 0 && value.length < allValues.length;

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between min-h-10", className)}
            style={style}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="mr-1 mb-1 px-2 py-1 text-xs"
                  >
                    {option.label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(option.value);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(option.value)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-[999999]" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-2 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Select All Option */}
                  {options.length > 0 && (
                    <CommandItem
                      key="select-all"
                      onSelect={() => handleSelect("select-all")}
                      style={style}
                      className="font-medium border-b border-border/50"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isAllSelected
                            ? "opacity-100"
                            : isPartiallySelected
                            ? "opacity-50"
                            : "opacity-0"
                        )}
                      />
                      {isAllSelected ? "Deselect All" : "Select All"}
                      <span className="ml-auto text-xs text-muted-foreground">
                        ({options.length})
                      </span>
                    </CommandItem>
                  )}

                  {/* Clear All Option */}
                  {value.length > 0 && (
                    <CommandItem
                      key="clear-all"
                      onSelect={() => handleSelect("clear-all")}
                      style={style}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear All
                      <span className="ml-auto text-xs text-muted-foreground">
                        ({value.length})
                      </span>
                    </CommandItem>
                  )}

                  {/* Regular Options */}
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      style={style}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedOptions.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedOptions.length} selected
        </div>
      )}
    </div>
  );
}
