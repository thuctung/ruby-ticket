import { MouseEventHandler } from "react";

export type OrderItemType = {
  date_use: string;
  price: string;
  product_code: string;
  product_name: string;
  quantity: string;
};

export type OrderType = {
  id: string;
  total_amount: string;
  status: string;
  created_at: string;
  user_email: string;
  phone: string;
  payment_code: string;
  order_code: string;
  site_code: string;
  third_party_number: string;
  fullname: string;
  status_payment: string;
  order_items: OrderItemType[];
};

export type CommonType = {
  loadingGlobal: boolean;
  messageToast: string;
  confirm: ConfirmType;

  setGlobalLoading: (value: boolean) => void;

  setToastMessage: (value: string) => void;

  showConfirm: (value: ConfirmType) => void;
};

export type UpdatePaymentStatusType = {
  message: string;
  orderCode: string;
  status: string;
};

export type ConfirmType = {
  message: string | null;
  okFunc: Function | null;
  textOk: string | null;
  onCancle: Function | null;
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

export type SideCard = {
  id: string;
  code: string;
  name: string;
  pre_price: number;
  exp: ExperienceCard;
  status: boolean;
};

export type ExperienceCard = {
  key: string;
  nameKey: string;
  taglineKey: string;
  badgeKey: string;
  image1: string;
  image2: string;
  color: string;
  category: string;
  alt: string;
};

export type LangKey = "vi" | "en" | "zh" | "ko";

export type ButtonProp = {
  onClick: MouseEventHandler;
  classMore?: string;
  title?: string;
};

export type SelectBoxProps = {
  value: string;
  onChange: (value: string) => void;
  firstOption?: boolean;
  className?: string;
  children: any;
  style?: any;
};

export type InputProps = {
  value: string;
  onChange: (value: string) => void;
  type: string;
  className?: string;
  placeholder: string;
};
