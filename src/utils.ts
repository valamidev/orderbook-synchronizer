import { Order, OrderbookData } from './types';

export const updateIndex = (sortedArray: Order[], item: Order, index: number, memory_limit: number = 0) => {
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

export const getSortedIndex = (array: Order[], value: number, inverse: boolean = false) => {
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

export const cleanOrderbookBid = (array: Order[], order: Order) => {
  for (let i = 0; i < array.length; i++) {
    if (order.price < array[i].price) {
      array.splice(i, 1);
    } else {
      return i;
    }
  }
};

export const cleanOrderbookAsk = (array: Order[], order: Order) => {
  for (let i = 0; i < array.length; i++) {
    if (order.price > array[i].price) {
      array.splice(i, 1);
    } else {
      return i;
    }
  }
};

export const processOrderbookUpdate = (data: OrderbookData, asks: Order[], bids: Order[], memory_limit: number) => {
  for (const order of asks) {
    updateIndex(data.asks, order, getSortedIndex(data.asks, order.price, false), memory_limit);

    if (data.best_bid && order.price < data.best_bid.price && order.size !== 0) {
      cleanOrderbookBid(data.bids, order);
    }

    data.best_ask = data.asks[0] || {};
  }

  for (const order of bids) {
    updateIndex(data.bids, order, getSortedIndex(data.bids, order.price, true), memory_limit);
    if (data.best_ask && order.price > data.best_ask.price && order.size !== 0) {
      cleanOrderbookAsk(data.asks, order);
    }
    data.best_bid = data.bids[0] || {};
  }

  data.best_ask = data.asks[0] || {};
  data.best_bid = data.bids[0] || {};

  return data;
};
