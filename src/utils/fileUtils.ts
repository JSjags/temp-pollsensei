import { Dispatch, SetStateAction } from "react";

export const handleParentClick = (ref: React.RefObject<HTMLInputElement>) => {
  ref.current?.click();
};

export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFile: Dispatch<SetStateAction<File | null>>,
  type: string
) => {
  const file = e.target.files?.[0];
  if (file) {
    setFile(file);
  }
};
