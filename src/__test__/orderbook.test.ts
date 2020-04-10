import { OrderBookStore, Orderbook } from '../index';
import { Order } from '../types';

describe('Orderbook Synchronizer', () => {
  it('should OrderBookStore not succeed memory limit', () => {
    const OrderBooks = new OrderBookStore(1000);

    const symbol = 'BTCUSDT';

    const round = 1001;

    for (let i = 0; i < round; i++) {
      const asks: Order[] = [[8000 + i, 2 * Math.random()]];
      const bids: Order[] = [[6000 + i, 2 * Math.random()]];

      OrderBooks.updateOrderBook(symbol, asks, bids);
    }

    let OrderBookResult = OrderBooks.getOrderBook(symbol);

    expect(OrderBooks.getOrderBook(symbol).asks).toHaveLength(1000);
  });

  it('OrderBookStore Cleanup Test', () => {
    const OrderBooks = new OrderBookStore(1000);

    let symbol = 'BTCUSDT';

    let round = 10000;

    for (let i = 0; i < round; i++) {
      const asks: Order[] = [[100 * Math.random(), 2 * Math.random()]];
      const bids: Order[] = [[100 * Math.random(), 2 * Math.random()]];

      OrderBooks.updateOrderBook(symbol, asks, bids);
    }

    OrderBooks.updateOrderBook(symbol, [[90, 2]], [[90, 2]]);
    OrderBooks.updateOrderBook(symbol, [[90, 2]], [[90, 2]]);
    OrderBooks.updateOrderBook(symbol, [[90, 2]], [[90, 2]]);

    let OrderBookResult = OrderBooks.getOrderBook(symbol);

    expect(OrderBookResult.bids[0][0]).toBeLessThanOrEqual(OrderBookResult.asks[0][0]);
  });

  it('should store and handle Orderbook Symbols', () => {
    const OrderBooks = new OrderBookStore(10);

    const symbol = 'BTCUSDT';

    const round = 11;

    for (let i = 0; i < round; i++) {
      const asks: Order[] = [[100 * Math.random(), 2 * Math.random()]];
      const bids: Order[] = [[100 * Math.random(), 2 * Math.random()]];

      OrderBooks.updateOrderBook(symbol, asks, bids);
    }

    expect(OrderBooks.getSymbolList()).toStrictEqual(expect.any(Array));
    expect(OrderBooks.hasOrderBook(symbol)).toBe(true);
    expect(OrderBooks.hasOrderBook('none')).toBe(false);
    expect(OrderBooks.getOrderBook(symbol)).toStrictEqual(expect.any(Object));
    expect(OrderBooks.getOrderBook('none')).toBe(undefined);
  });

  it('OrderBook Memory limit Test', () => {
    let symbol = 'BTCUSDT';

    const SingleOrderBook = new Orderbook(symbol, 1000);

    let round = 1001;

    for (let i = 0; i < round; i++) {
      const asks: Order[] = [[8000 + i, 2 * Math.random()]];
      const bids: Order[] = [[6000 + i, 2 * Math.random()]];

      SingleOrderBook.updateOrderBook(asks, bids);
    }

    expect(SingleOrderBook.getOrderBook().asks.length).toBe(1000);
  });

  it('OrderBookCleanup Test', () => {
    let symbol = 'BTCUSDT';

    const SingleOrderBook = new Orderbook(symbol, 1000);

    let round = 10000;

    for (let i = 0; i < round; i++) {
      const asks: Order[] = [[100 * Math.random(), 2 * Math.random()]];
      const bids: Order[] = [[100 * Math.random(), 2 * Math.random()]];

      SingleOrderBook.updateOrderBook(asks, bids);
    }

    SingleOrderBook.updateOrderBook([[90, 2]], [[90, 2]]);
    SingleOrderBook.updateOrderBook([[90, 2]], [[90, 2]]);
    SingleOrderBook.updateOrderBook([[90, 2]], [[90, 2]]);

    let OrderBookResult = SingleOrderBook.getOrderBook();

    expect(OrderBookResult.bids[0][0]).toBeLessThanOrEqual(OrderBookResult.asks[0][0]);
  });
});
