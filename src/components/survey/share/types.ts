import { IconType } from "react-icons";

export type SocialMediaKey =
  | "whatsapp"
  | "twitter"
  | "linkedin"
  | "facebook"
  | "telegram"
  | "gmail";

export interface ShareSurveyProps {
  onClick?: () => void;
  _id?: string;
}

export interface SocialMediaIconProps {
  icon: IconType;
  className: string;
  href: string;
}

export interface CopyLinkProps {
  value: string;
  isLoading: boolean;
}
