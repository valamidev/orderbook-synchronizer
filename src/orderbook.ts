import { OrderbookData, Order } from './types';
import { processOrderbookUpdate } from './utils';

export class Orderbook {
  _data: OrderbookData;
  protected symbol: string;
  private memoryLimit: number;

  constructor(symbol = 'none', memoryLimit = 0) {
    this._data = {
      asks: [],
      bids: [],
    };
    this.symbol = symbol;
    this.memoryLimit = memoryLimit;
  }

  public getOrderBook(): OrderbookData {
    return this._data;
  }

  public updateOrderBook(asks: Order[], bids: Order[]): void {
    const { memoryLimit } = this;
    const data = this._data;

    this._data = processOrderbookUpdate({ ...data }, asks, bids, memoryLimit);
  }
}
