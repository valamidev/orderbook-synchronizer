import { OrderbookData, Order } from './types';
import { processOrderbookUpdate } from './utils';

export class OrderBookStore {
  _data: Map<string, OrderbookData | undefined>;
  private memoryLimit: number;

  constructor(memoryLimit = 0) {
    this._data = new Map();
    this.memoryLimit = memoryLimit;
  }

  public getSymbolList(): string[] {
    return [...this._data.keys()];
  }

  public hasOrderBook(symbol: string): boolean {
    return this._data.has(symbol);
  }

  public getOrderBook(symbol: string): OrderbookData | undefined {
    return this._data.get(symbol);
  }

  public updateOrderBook(symbol: string, asks: Order[], bids: Order[]): void {
    const { memoryLimit } = this;
    const data = this._data.get(symbol);

    if (data) {
      this._data.set(symbol, processOrderbookUpdate({ ...data }, asks, bids, memoryLimit));
      return;
    }

    this._data.set(symbol, processOrderbookUpdate({ asks: [], bids: [] }, asks, bids, memoryLimit));
  }
}
