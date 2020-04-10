/** [price, amount] */
export type Order = [number, number];

export interface OrderbookData {
  asks: Order[];
  bids: Order[];
}
