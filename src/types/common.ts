import { I18nKey } from "@/lib/i18n/keys";
import { MouseEventHandler } from "react";

export type CommonType = {
  loadingGlobal: boolean;
  messageToast: string;
  confirm: ConfirmType;

  setGlobalLoading: (value: boolean) => void;

  setToastMessage: (value: string) => void;

  showConfirm: (value: ConfirmType) => void;
};

export type ConfirmType = {
  message: string | null;
  okFunc: Function | null;
};

export type MenuMgtType = {
  link: string;
  lable: string;
  color?: string;
  icon?: any;
};

export type StatusType = {
  title: string;
  value: string;
};

export type LocationCard = {
  id: string;
  code: string;
  name: string;
  pre_price: number;
  exp: ExperienceCard;
};

export type ExperienceCard = {
  key: string;
  nameKey: I18nKey;
  taglineKey: I18nKey;
  badgeKey: I18nKey;
  image1: string;
  image2: string;
  color: string;
  category: string;
};

export type LangKey = "vi" | "en" | "zh" | "ko";

export type ButtonProp = {
  onClick: MouseEventHandler;
  classMore?: string;
};

export type SelectBoxProps = {
  value: string;
  onChange: (value: string) => void;
  firstOption?: boolean;
  className?: string;
  children: any;
};

export type InputProps = {
  value: string;
  onChange: (value: string) => void;
  type: string;
  className?: string;
  placeholder: string;
};
