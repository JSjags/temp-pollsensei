import * as React from "react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/shadcn-input";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

interface ColorPickerProps {
  field?: {
    value?: string;
    onChange?: (value: string) => void;
  };
  value?: string;
  onChange?: (value: string) => void;
}

export function ColorPicker({ field, value, onChange }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(
    field?.value ?? value ?? "#000000"
  );
  const [inputColor, setInputColor] = useState(
    field?.value ?? value ?? "#000000"
  );

  const colors = [
    "#FF0000",
    "#FF4D00",
    "#FF9900",
    "#FFE600",
    "#CCFF00",
    "#80FF00",
    "#33FF00",
    "#00FF19",
    "#00FF66",
    "#00FFB3",
    "#00FFFF",
    "#00B3FF",
    "#0066FF",
    "#0019FF",
    "#3300FF",
    "#8000FF",
    "#CC00FF",
    "#FF00E6",
    "#FF0099",
    "#FF004D",
    "#808080",
    "#FFFFFF",
    "#000000",
    "#4A4A4A",
  ];

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    setInputColor(newColor);
    field?.onChange?.(newColor);
    onChange?.(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputColor(newColor);
    if (/^#([A-Fa-f0-9]{6})$/.test(newColor)) {
      handleColorChange(newColor);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-8 gap-2 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-md border transition-all duration-200 ${
              selectedColor === color
                ? "ring-2 ring-offset-2 ring-blue-500"
                : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="hex-input">Hex Code</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              id="hex-input"
              type="text"
              value={inputColor.replace("#", "")}
              onChange={(e) => {
                const newColor = e.target.value;
                setInputColor(`#${newColor.replace("#", "")}`);
              }}
              className="pl-7"
              placeholder="000000"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              #
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => {
                const colorValue = inputColor.replace("#", "");
                if (/^([A-Fa-f0-9]{6})$/.test(colorValue)) {
                  handleColorChange(`#${colorValue}`);
                }
              }}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          <div
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>
    </div>
  );
}
