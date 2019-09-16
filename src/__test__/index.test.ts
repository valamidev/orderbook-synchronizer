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

   import {OrderBookStore,Orderbook} from "../index"

   test('OrderBookStore Memory limit Test', () => {

    let Orderbooks = new OrderBookStore(1000)
   
    let symbol = "BTCUSDT"
    
    let round = 1001
    
    for (let i = 0; i < round; i++) {
      let asks = [{ price: 8000 + i, size: 2 * Math.random() }]
      let bids = [{ price: 6000 + i, size: 2 * Math.random() }]
    
      Orderbooks.updateOrderBook(symbol, asks, bids)
    }
    
    expect(Orderbooks.getOrderBook(symbol).ask.length).toBe(1000);
  });


  test('OrderBookStore Cleanup Test', () => {

    let Orderbooks = new OrderBookStore(1000)
   
    let symbol = "BTCUSDT"
    
    let round = 10000
    
    for (let i = 0; i < round; i++) {
      let asks = [{ price: 100 * Math.random(), size: 2 * Math.random() }]
      let bids = [{ price: 100 * Math.random(), size: 2 * Math.random() }]
    
      Orderbooks.updateOrderBook(symbol, asks, bids)
    }

    // Clean up Orders
    Orderbooks.updateOrderBook(symbol, [{ price: 90, size: 2 }], [{ price: 90 , size: 2 }])    
    Orderbooks.updateOrderBook(symbol, [{ price: 90, size: 2 }], [{ price: 90 , size: 2 }])  
    Orderbooks.updateOrderBook(symbol, [{ price: 90, size: 2 }], [{ price: 90 , size: 2 }]) 

    let OrderBookResult = Orderbooks.getOrderBook(symbol);

    expect(OrderBookResult.best_bid.price ==  OrderBookResult.best_ask.price).toBe(true);
    
  });


  test('OrderBook Memory limit Test', () => {

    let symbol = "BTCUSDT"

    let SingleOrderbook = new Orderbook(symbol,1000)

    
    let round = 1001
    
    for (let i = 0; i < round; i++) {
      let asks = [{ price: 8000 + i, size: 2 * Math.random() }]
      let bids = [{ price: 6000 + i, size: 2 * Math.random() }]
    
      SingleOrderbook.updateOrderBook( asks, bids)
    }
    
    expect(SingleOrderbook.getOrderBook().ask.length).toBe(1000);
  });


  test('OrderBookCleanup Test', () => {

    let symbol = "BTCUSDT"

    let SingleOrderbook = new Orderbook(symbol,1000)
    
    let round = 10000
    
    for (let i = 0; i < round; i++) {
      let asks = [{ price: 100 * Math.random(), size: 2 * Math.random() }]
      let bids = [{ price: 100 * Math.random(), size: 2 * Math.random() }]
    
      SingleOrderbook.updateOrderBook(asks, bids)
    }

    // Clean up Orders
    SingleOrderbook.updateOrderBook( [{ price: 90, size: 2 }], [{ price: 90 , size: 2 }])    
    SingleOrderbook.updateOrderBook( [{ price: 90, size: 2 }], [{ price: 90 , size: 2 }])  
    SingleOrderbook.updateOrderBook( [{ price: 90, size: 2 }], [{ price: 90 , size: 2 }]) 

    let OrderBookResult = SingleOrderbook.getOrderBook();

    expect(OrderBookResult.best_bid.price ==  OrderBookResult.best_ask.price).toBe(true);
    
  });