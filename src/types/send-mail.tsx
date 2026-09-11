export type SendMailBaNaType = {
  mail: string;
  siteName: string;
  orderCode: string;
  fileAttch: Buffer<ArrayBuffer>;
};

export type MailQueueType = {
  is_send_foc: boolean;
  order_code: string;
  site_name: string;
  order_id: string;
  status: string;
  email: string;
  id: string;
  retry_count: number;
};
