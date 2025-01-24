import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FontOption,
  SizeOption,
  FontSettings,
} from "@/types/style-editor.types";
import { cn } from "@/lib/utils";
import {
  DM_Sans,
  Lexend,
  Roboto,
  Playfair_Display,
  Montserrat,
  Lora,
  Merriweather,
} from "next/font/google";
import { SurveyData } from "@/subpages/survey/EditSubmittedSurvey";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

interface FontSelectorProps {
  label: string;
  value: string;
  font: FontSettings;
  setFont: (font: FontSettings) => void;
  fontOptions: FontOption[];
  sizeOptions: SizeOption[];
  surveyData?: SurveyData;
  setSurveyData?: React.Dispatch<React.SetStateAction<SurveyData>>;
}

const FontSelector = ({
  label,
  value,
  font,
  setFont,
  fontOptions,
  sizeOptions,
  surveyData,
  setSurveyData,
}: FontSelectorProps) => {
  const selectedFont = fontOptions.find(
    (f) => f.value === (font?.name || "DM Sans")
  );

  return (
    <div className={cn("text-style-option flex flex-col gap-1")}>
      <label className="mt-4">{label}</label>
      <div className="flex gap-2 items-center w-full">
        <Select
          value={font?.name || "DM Sans"}
          onValueChange={(value) => {
            setFont({ ...font, name: value });
            if (surveyData && setSurveyData) {
              setSurveyData({
                ...surveyData,
                [value]: { ...font, name: value },
              });
            }
          }}
        >
          <SelectTrigger className={cn("w-full", selectedFont?.className)}>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem
                key={font.value}
                value={font.value}
                className={cn(font.className)}
              >
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={font?.size.toString()}
          onValueChange={(value) => setFont({ ...font, size: parseInt(value) })}
        >
          <SelectTrigger className="w-[20%]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((size) => (
              <SelectItem key={size.value} value={size?.value.toString()}>
                {size?.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FontSelector;
