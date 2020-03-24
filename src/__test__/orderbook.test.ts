/*
      {
        eventType: 'depthUpdate',
        eventTime: 1564411435348,
        symbol: 'BTCUSDT',
        firstUpdateId: 905213181,
        finalUpdateId: 905213198,
        bidDepth: [
          { price: '9558.02000000', quantity: '0.11576700' },
          { price: '9552.36000000', quantity: '0.00000000' }
        ],
        askDepth: [
          { price: '9558.98000000', quantity: '0.00100800' },
          { price: '9566.05000000', quantity: '0.00000000' },
        ]
      }
    */
/*
      sequenceStart: 1556425985882,
      symbol: 'XRP-BTC',
      changes: { asks: [], bids: [ [ '0.00003232', '5240.6325', '1556426078793' ] ] }, 
      sequenceEnd: 1556425985882
    */

import { OrderBookStore, Orderbook } from '../index';

describe('Orderbook Synchronizer', () => {
  it('should OrderBookStore not succeed memory limit', () => {
    const OrderBooks = new OrderBookStore(1000);

    const symbol = 'BTCUSDT';

    const round = 1001;

    for (let i = 0; i < round; i++) {
      const asks = [{ price: 8000 + i, size: 2 * Math.random() }];
      const bids = [{ price: 6000 + i, size: 2 * Math.random() }];

      OrderBooks.updateOrderBook(symbol, asks, bids);
    }

    expect(OrderBooks.getOrderBook(symbol).ask.length).toBe(1000);
  });

  it('OrderBookStore Cleanup Test', () => {
    const OrderBooks = new OrderBookStore(1000);

    let symbol = 'BTCUSDT';

    let round = 10000;

    for (let i = 0; i < round; i++) {
      let asks = [{ price: 100 * Math.random(), size: 2 * Math.random() }];
      let bids = [{ price: 100 * Math.random(), size: 2 * Math.random() }];

      OrderBooks.updateOrderBook(symbol, asks, bids);
    }

    // Clean up Orders
    OrderBooks.updateOrderBook(symbol, [{ price: 90, size: 2 }], [{ price: 90, size: 2 }]);
    OrderBooks.updateOrderBook(symbol, [{ price: 90, size: 2 }], [{ price: 90, size: 2 }]);
    OrderBooks.updateOrderBook(symbol, [{ price: 90, size: 2 }], [{ price: 90, size: 2 }]);

    let OrderBookResult = OrderBooks.getOrderBook(symbol);

    expect(OrderBookResult.best_bid.price).toBe(OrderBookResult.best_ask.price);
  });

  it('OrderBook Memory limit Test', () => {
    let symbol = 'BTCUSDT';

    const SingleOrderBook = new Orderbook(symbol, 1000);

    let round = 1001;

    for (let i = 0; i < round; i++) {
      let asks = [{ price: 8000 + i, size: 2 * Math.random() }];
      let bids = [{ price: 6000 + i, size: 2 * Math.random() }];

      SingleOrderBook.updateOrderBook(asks, bids);
    }

    expect(SingleOrderBook.getOrderBook().ask.length).toBe(1000);
  });

  it('OrderBookCleanup Test', () => {
    let symbol = 'BTCUSDT';

    const SingleOrderBook = new Orderbook(symbol, 1000);

    let round = 10000;

    for (let i = 0; i < round; i++) {
      let asks = [{ price: 100 * Math.random(), size: 2 * Math.random() }];
      let bids = [{ price: 100 * Math.random(), size: 2 * Math.random() }];

      SingleOrderBook.updateOrderBook(asks, bids);
    }

    // Clean up Orders
    SingleOrderBook.updateOrderBook([{ price: 90, size: 2 }], [{ price: 90, size: 2 }]);
    SingleOrderBook.updateOrderBook([{ price: 90, size: 2 }], [{ price: 90, size: 2 }]);
    SingleOrderBook.updateOrderBook([{ price: 90, size: 2 }], [{ price: 90, size: 2 }]);

    let OrderBookResult = SingleOrderBook.getOrderBook();

    expect(OrderBookResult.best_bid.price).toBe(OrderBookResult.best_ask.price);
  });
});
