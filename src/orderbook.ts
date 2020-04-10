import { OrderbookData, Order } from './types';
import { processOrderbookUpdate } from './utils';

export class Orderbook {
  _data: OrderbookData;
  protected symbol: string;
  private memory_limit: number;

  constructor(symbol = 'none', memory_limit = 0, verbose = true) {
    this._data = {
      asks: [],
      bids: [],
    };
    this.symbol = symbol;
    this.memory_limit = memory_limit;
  }

  public getOrderBook() {
    return this._data;
  }

  public updateOrderBook(asks: Order[], bids: Order[]): void {
    const memory_limit = this.memory_limit;
    const data = this._data;

    this._data = processOrderbookUpdate({ ...data }, asks, bids, memory_limit);

    return;
  }
}
