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

let Orderbooks = new OrderBookStore(1000)

let symbol = "BTCUSDT"

let round = 300000

console.time("OrderbookLoop")

for (let i = 0; i < round; i++) {
  let asks = [{ price: 8000 + 2000 * Math.random(), size: 2 * Math.random() }]
  let bids = [{ price: 8000 + 2000 * Math.random(), size: 2 * Math.random() }]

  Orderbooks.updateOrderBook(symbol, asks, bids)
}

let asks = [{ price: 9500, size: 2 }]
let bids = [{ price: 9400, size: 2 }]

Orderbooks.updateOrderBook(symbol, asks, bids)
Orderbooks.updateOrderBook(symbol, asks, bids)

console.log(Orderbooks.getOrderBook(symbol))

console.timeEnd("OrderbookLoop")
