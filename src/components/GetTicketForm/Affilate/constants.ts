export const ORDER_PRODUCT_IN_BANA: Record<number, number> = {
  10001242: 1,
  10001168: 2,
  10000977: 3,
  10003556: 4,
  10000978: 5,
  10000986: 6,
  10003557: 7,
  10000991: 8,
  10000990: 9,
  1000099: 10,
  10000995: 11,
  10000987: 12,
  10003560: 13,
  10000992: 14,
  10000974: 15,
  10000975: 16,
  10000980: 17,
  10000982: 18,
  10000984: 19,
};

export const getOrder = (productId: number): number => {
  return ORDER_PRODUCT_IN_BANA[productId] ?? 100;
};
