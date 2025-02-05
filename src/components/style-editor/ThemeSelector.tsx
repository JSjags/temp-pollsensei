import Image from "next/image";
import { defaultBg, neon, sparkly } from "@/assets/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { saveTheme } from "@/redux/slices/survey.slice";
import { motion } from "framer-motion";

interface ThemeSelectorProps {
  initialTheme?: string;
  setSurveyData?: React.Dispatch<React.SetStateAction<any>>;
}

const ThemeSelector = ({ initialTheme, setSurveyData }: ThemeSelectorProps) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state?.survey?.theme);

  const themes = [
    { id: "default", image: defaultBg, label: "Default" },
    { id: "neon", image: neon, label: "Neon" },
    { id: "sparkly", image: sparkly, label: "Sparkly" },
  ];

  console.log(initialTheme);

  const handleThemeChange = (themeId: string) => {
    dispatch(saveTheme(themeId));
    if (setSurveyData) {
      setSurveyData((prev: any) => ({
        ...prev,
        theme: themeId,
      }));
    }
  };

  const currentTheme = initialTheme || theme;

  return (
    <div className="theme-selector px-10 border-b py-5">
      <h4 className="font-bold">Theme</h4>
      <div className="flex w-full justify-between gap-2 items-center pt-3">
        {themes.map((item) => (
          <div
            key={item.id}
            className="flex-1 flex flex-col w-1/3 h-24 relative"
            onClick={() => handleThemeChange(item.id)}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: currentTheme === item.id ? 1 : 0,
                opacity: currentTheme === item.id ? 1 : 0,
              }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
              className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] rounded-full p-1.5 z-10"
            >
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <Image
              src={item.image}
              alt=""
              className={`${
                currentTheme === item.id
                  ? "border-2 rounded-lg border-[#9D50BB]"
                  : ""
              } w-full`}
            />
            <span className="text-sm font-normal">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
