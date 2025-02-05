import { Dispatch, SetStateAction } from "react";

interface ColorPickerProps {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  onColorChange: (color: string) => void;
}

const ColorPicker = ({ color, setColor, onColorChange }: ColorPickerProps) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B59B6",
    "#3498DB",
    "#E74C3C",
    "#2ECC71",
    "#F1C40F",
    "#34495E",
  ];

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      handleColorChange(newColor);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2 mb-4">
        {colors.map((colorOption, index) => (
          <button
            key={index}
            className={`w-full h-10 rounded-md border ${
              color === colorOption ? "ring-2 ring-offset-2 ring-blue-500" : ""
            }`}
            style={{ backgroundColor: colorOption }}
            onClick={() => handleColorChange(colorOption)}
            aria-label={`Select color ${colorOption}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={color}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="#000000"
          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        />
        <div
          className="w-10 h-10 rounded-md border"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
