"use client";

import React from "react";
import Select, { MultiValue, SingleValue, StylesConfig } from "react-select";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface ReactSelectMultiProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isDisabled?: boolean;
}

export function ReactSelectMulti({
  options,
  value,
  onChange,
  placeholder = "Select...",
  loading = false,
  className,
  style,
  isDisabled = false,
}: ReactSelectMultiProps) {
  // Debug logging
  console.log("ReactSelectMulti props:", { options, value, placeholder });

  // Convert string array to react-select format
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  console.log("ReactSelectMulti selectedOptions:", selectedOptions);

  const handleChange = (selectedOptions: MultiValue<Option>) => {
    console.log("ReactSelectMulti handleChange called with:", selectedOptions);
    const newValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    console.log("ReactSelectMulti newValues:", newValues);
    onChange(newValues);
  };

  // Custom styles to match shadcn/ui design
  const customStyles: StylesConfig<Option, true> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      border: "1px solid hsl(var(--border))",
      borderColor: state.isFocused
        ? "hsl(var(--ring))"
        : state.isDisabled
        ? "hsl(var(--border))"
        : "hsl(var(--border))",
      boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring) / 0.2)" : "none",
      "&:hover": {
        borderColor: state.isDisabled
          ? "hsl(var(--border))"
          : "hsl(var(--border))",
      },
      backgroundColor: state.isDisabled
        ? "hsl(var(--muted) / 0.5)"
        : "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      borderRadius: "6px",
      fontSize: "14px",
      transition: "all 0.2s ease-in-out",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "8px 12px",
      gap: "4px",
    }),
    input: (provided) => ({
      ...provided,
      color: "hsl(var(--foreground))",
      margin: "0",
      padding: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      fontSize: "14px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      color: "transparent",
      borderRadius: "0",
      margin: "0",
      padding: "0",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "transparent",
      fontSize: "0",
      padding: "0",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "transparent",
      "&:hover": {
        backgroundColor: "transparent",
        color: "transparent",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "6px",
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      zIndex: 50,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px",
      maxHeight: "200px",
    }),
    option: (provided, state) => {
      const isSelectAll = (state.data as any)?.isSelectAll;
      const isClearAll = (state.data as any)?.isClearAll;
      const isSelected = state.isSelected;

      return {
        ...provided,
        backgroundColor: state.isFocused ? "hsl(var(--accent))" : "transparent",
        color: isClearAll
          ? "hsl(var(--destructive))"
          : isSelectAll
          ? "hsl(var(--primary))"
          : "hsl(var(--foreground))",
        borderRadius: "4px",
        margin: "2px 0",
        padding: "8px 12px",
        cursor: "pointer",
        fontWeight: isSelectAll || isClearAll ? "600" : "normal",
        borderBottom: isSelectAll ? "1px solid hsl(var(--border))" : "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        "&:hover": {
          backgroundColor: isClearAll
            ? "hsl(var(--destructive) / 0.1)"
            : isSelectAll
            ? "hsl(var(--primary) / 0.1)"
            : "hsl(var(--accent))",
        },
      };
    },
    noOptionsMessage: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      padding: "12px",
      fontSize: "14px",
    }),
    loadingMessage: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      padding: "12px",
      fontSize: "14px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "hsl(var(--border))",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      padding: "8px",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      padding: "8px",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
  };

  // Custom ValueContainer to show count instead of individual tags
  const ValueContainer = ({ children, ...props }: any) => {
    const selectedCount = selectedOptions.length;

    return (
      <div className="react-select__value-container" {...props}>
        {selectedCount > 0 ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-sm text-foreground truncate whitespace-nowrap">
              {selectedCount} {selectedCount === 1 ? "country" : "countries"}{" "}
              selected
            </span>
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    );
  };

  // Custom MultiValue component to hide individual tags
  const MultiValue = () => null;

  // Custom Option component to show checkmarks
  const Option = (props: any) => {
    const { data, isSelected, innerRef, innerProps } = props;
    const isSelectAll = data?.isSelectAll;
    const isClearAll = data?.isClearAll;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-sm"
      >
        {!isSelectAll && !isClearAll && (
          <div className="w-4 h-4 flex items-center justify-center">
            {isSelected ? (
              <svg
                className="w-4 h-4 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <div className="w-4 h-4 border border-border rounded-sm" />
            )}
          </div>
        )}
        <span className="flex-1">{data.label}</span>
      </div>
    );
  };

  // Add select all and clear all options
  const allOptions = [
    {
      value: "select-all",
      label: `Select All (${options.length})`,
      isSelectAll: true,
    },
    {
      value: "clear-all",
      label: "Clear All",
      isClearAll: true,
    },
    ...options,
  ];

  const handleSelectChange = (selectedOptions: MultiValue<Option>) => {
    console.log("ReactSelectMulti handleChange called with:", selectedOptions);

    if (!selectedOptions) {
      onChange([]);
      return;
    }

    // Check if select all was clicked
    const selectAllOption = selectedOptions.find(
      (option) => (option as any).isSelectAll
    );
    if (selectAllOption) {
      const allValues = options.map((option) => option.value);
      onChange(allValues);
      return;
    }

    // Check if clear all was clicked
    const clearAllOption = selectedOptions.find(
      (option) => (option as any).isClearAll
    );
    if (clearAllOption) {
      onChange([]);
      return;
    }

    // Regular selection
    const newValues = selectedOptions
      .filter(
        (option) => !(option as any).isSelectAll && !(option as any).isClearAll
      )
      .map((option) => option.value);

    console.log("ReactSelectMulti newValues:", newValues);
    onChange(newValues);
  };

  return (
    <div className={cn("space-y-2", className)} style={style}>
      <Select
        isMulti
        options={allOptions}
        value={selectedOptions}
        onChange={handleSelectChange}
        placeholder={placeholder}
        isLoading={loading}
        isDisabled={isDisabled}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        closeMenuOnSelect={false} // Keep menu open for multiple selections
        hideSelectedOptions={false} // Show selected options in the list
        isClearable={false} // Disable default clear button since we have custom clear all
        isSearchable={true} // Enable search functionality
        menuPlacement="auto" // Auto position menu
        maxMenuHeight={200} // Limit menu height
        noOptionsMessage={() => "No options found"}
        loadingMessage={() => "Loading..."}
        components={{
          ValueContainer,
          MultiValue,
          Option,
        }}
      />
    </div>
  );
}
