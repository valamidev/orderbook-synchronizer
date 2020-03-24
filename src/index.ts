import { Order, OrderbookData } from './types';

const updateIndex = (sortedArray: Order[], item: Order, index: number, memory_limit: number = 0) => {
  item.size = Number(item.size);
  item.price = Number(item.price);

  if (index < sortedArray.length && Number(sortedArray[index].price) === item.price) {
    if (item.size === 0) {
      sortedArray.splice(index, 1);
    } else {
      sortedArray[index].size = item.size;
    }
  } else if (item.size !== 0) {
    sortedArray.splice(index, 0, item);
  }

  if (memory_limit !== 0 && sortedArray.length > memory_limit) {
    sortedArray.splice(memory_limit, sortedArray.length - memory_limit);
  }
  return index === 0;
};

const getSortedIndex = (array: Order[], value: number, inverse: boolean = false) => {
  let low = 0;
  let high = array ? array.length : low;

  while (low < high) {
    // tslint:disable-next-line: no-bitwise
    const mid = (low + high) >>> 1;
    if ((!inverse && +array[mid].price < +value) || (inverse && +array[mid].price > +value)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};

const cleanOrderbookBid = (array: Order[], order: Order) => {
  for (let i = 0; i < array.length; i++) {
    if (order.price < array[i].price) {
      array.splice(i, 1);
    } else {
      return i;
    }
  }
};

const cleanOrderbookAsk = (array: Order[], order: Order) => {
  for (let i = 0; i < array.length; i++) {
    if (order.price > array[i].price) {
      array.splice(i, 1);
    } else {
      return i;
    }
  }
};

const processOrderbookUpdate = (data: OrderbookData, ask: Order[], bid: Order[], memory_limit: number) => {
  for (const order of ask) {
    updateIndex(data.ask, order, getSortedIndex(data.ask, order.price, false), memory_limit);

    if (data.best_bid && order.price < data.best_bid.price && order.size !== 0) {
      cleanOrderbookBid(data.bid, order);
    }

    data.best_ask = data.ask[0] || {};
  }

  for (const order of bid) {
    updateIndex(data.bid, order, getSortedIndex(data.bid, order.price, true), memory_limit);
    if (data.best_ask && order.price > data.best_ask.price && order.size !== 0) {
      cleanOrderbookAsk(data.ask, order);
    }
    data.best_bid = data.bid[0] || {};
  }

  data.best_ask = data.ask[0] || {};
  data.best_bid = data.bid[0] || {};

  return data;
};

export class OrderBookStore {
  _data: Map<string, OrderbookData | undefined>;
  private memory_limit: number;

  constructor(memory_limit = 0) {
    this._data = new Map();
    this.memory_limit = memory_limit;
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

  public updateOrderBook(symbol: string, ask: Order[], bid: Order[]): void {
    const memory_limit = this.memory_limit;
    const data = this._data.get(symbol);

    if (data) {
      this._data.set(symbol, processOrderbookUpdate({ ...data }, ask, bid, memory_limit));
      return;
    }

    this._data.set(symbol, processOrderbookUpdate({ ask: [], bid: [] }, ask, bid, memory_limit));
  }
}

export class Orderbook {
  _data: OrderbookData;
  protected symbol: string;
  private memory_limit: number;

  constructor(symbol = 'none', memory_limit = 0) {
    this._data = {
      ask: [],
      bid: [],
    };
    this.symbol = symbol;
    this.memory_limit = memory_limit;
  }

  public getOrderBook() {
    return this._data;
  }

  public updateOrderBook(ask: Order[], bid: Order[]): void {
    const memory_limit = this.memory_limit;
    const data = this._data;

    this._data = processOrderbookUpdate({ ...data }, ask, bid, memory_limit);

    return;
  }
}
