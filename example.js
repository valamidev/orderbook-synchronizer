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

let { OrderBookStore } = require("./index")

let Orderbooks = new OrderBookStore()

let symbol = "BTCUSDT"

let asks = [{ price: "9558.98000000", size: "0.00100800" }, { price: "9566.05000000", size: "0.00000000" }]
let bids = [{ price: "9558.02000000", size: "0.11576700" }, { price: "9552.36000000", size: "3.00000000" }]
let asks2 = [{ price: "9551.98000001", size: "2" }, { price: "9566.05000000", size: "1.00000000" }]
let bids2 = [{ price: "9558.02000000", size: "2" }, { price: "9552.36000000", size: "1.00000000" }]

//OrderbookStore.snapshotOrderBook(symbol, asks, bids)
Orderbooks.updateOrderBook(symbol, asks, bids)

Orderbooks.updateOrderBook(symbol, asks2, bids2)

console.log(Orderbooks.getOrderBook(symbol))

///

let { Orderbook } = require("./index")

let SinlgeOrderbook = new Orderbook(symbol)

//OrderbookStore.snapshotOrderBook(symbol, asks, bids)
SinlgeOrderbook.updateOrderBook(asks, bids)

SinlgeOrderbook.updateOrderBook(asks2, bids2)

console.log(SinlgeOrderbook.getOrderBook())
