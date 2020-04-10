// tslint:disable-next-line: interface-name
export interface Order {
  price: number;
  size: number;
}

// tslint:disable-next-line: interface-name
export interface OrderbookData {
  asks: Order[];
  bids: Order[];
  best_ask?: Order;
  best_bid?: Order;
}
