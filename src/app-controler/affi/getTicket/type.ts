export type TicketInSystem = {
  name: string;
  quantity: number;
};

export type SendTicketInSystemMailType = {
  orderCode: string;
  phone: string;
  dateUse: string;
  listTicket: TicketInSystem[];
  email: string;
};
