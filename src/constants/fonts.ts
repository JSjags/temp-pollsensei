import { FontOption, SizeOption } from "@/types/style-editor.types";

export const fontOptions: FontOption[] = [
  { value: "DM Sans", label: "DM Sans", className: "font-sans" },
  { value: "Arial", label: "Arial", className: "font-arial" },
  {
    value: "Times New Roman",
    label: "Times New Roman",
    className: "font-times",
  },
  { value: "monospace", label: "Monospace", className: "font-monospace" },
  {
    value: "Brush Script MT",
    label: "Brush Script MT",
    className: "font-brush-script",
  },
  { value: "Lexend", label: "Lexend", className: "font-lexend" },
  { value: "Roboto", label: "Roboto", className: "font-roboto" },
  {
    value: "Playfair Display",
    label: "Playfair Display",
    className: "font-playfair-display",
  },
  { value: "Montserrat", label: "Montserrat", className: "font-montserrat" },
  { value: "Lora", label: "Lora", className: "font-lora" },
  {
    value: "Merriweather",
    label: "Merriweather",
    className: "font-merriweather",
  },
];

export const sizeOptions: SizeOption[] = [
  { value: 32, label: 32 },
  { value: 28, label: 28 },
  { value: 24, label: 24 },
  { value: 20, label: 20 },
  { value: 18, label: 18 },
  { value: 16, label: 16 },
  { value: 14, label: 14 },
  { value: 12, label: 12 },
];
