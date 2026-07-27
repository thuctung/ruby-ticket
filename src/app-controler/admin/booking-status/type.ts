export type AdminBookingStatusResponseType = {
  orderCode: string;
  orderStatus: string;
  pnr: string;
  referenceCode: string;
  thirdPartyNumber: string;
  totalOrderPrice: number;
  items: ItemBooking[];
};

export type ItemBooking = {
  productName: string;
  quantity: number;
};
