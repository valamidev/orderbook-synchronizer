import { Order, OrderbookData } from './types';

const updateIndex = (sortedArray: Order[], order: Order, index: number, memory_limit: number = 0) => {
  const price = Number(order[0]);
  const amount = Number(order[1]);

  if (index < sortedArray.length && Number(sortedArray[index][0]) === price) {
    if (amount === 0) {
      sortedArray.splice(index, 1);
    } else {
      sortedArray[index][1] = amount;
    }
  } else if (amount !== 0) {
    sortedArray.splice(index, 0, order);
  }

  if (memory_limit !== 0 && sortedArray.length > memory_limit) {
    sortedArray.splice(memory_limit, sortedArray.length - memory_limit);
  }
  return index === 0;
};

const getSortedIndex = (array: Order[], price: number, inverse: boolean = false) => {
  let low = 0;
  let high = array ? array.length : low;

  while (low < high) {
    const mid = (low + high) >>> 1;

    if ((!inverse && +array[mid][0] < +price) || (inverse && +array[mid][0] > +price)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};

const cleanOrderbookBid = (array: Order[], price: number) => {
  for (let i = 0; i < array.length; i++) {
    if (price < array[i][0]) {
      array.splice(i, 1);
    } else {
      return;
    }
  }
};

const cleanOrderbookAsk = (array: Order[], price: number) => {
  for (let i = 0; i < array.length; i++) {
    if (price > array[i][0]) {
      array.splice(i, 1);
    } else {
      return;
    }
  }
};

export const processOrderbookUpdate = (data: OrderbookData, asks: Order[], bids: Order[], memory_limit: number) => {
  for (const order of asks) {
    const price = Number(order[0]);
    const amount = Number(order[1]);

    updateIndex(data.asks, order, getSortedIndex(data.asks, price, false), memory_limit);

    if (amount !== 0 && data.asks[0]?.[0] < data.bids[0]?.[0]) {
      cleanOrderbookBid(data.bids, data.asks[0]?.[0]);
    }
  }

  for (const order of bids) {
    const price = Number(order[0]);
    const amount = Number(order[1]);

    updateIndex(data.bids, order, getSortedIndex(data.bids, price, true), memory_limit);

    if (amount !== 0 && data.bids[0]?.[0] > data.asks[0]?.[0]) {
      cleanOrderbookAsk(data.asks, data.bids[0]?.[0]);
    }
  }

  return data;
};
