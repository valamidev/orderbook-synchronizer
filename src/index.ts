import {Order,OrderbookData} from "./interfaces"


const updateIndex = (sortedArray: Order[], item: Order, index: number, memory_limit: number = 0) => {
  item.size = Number(item.size)
  item.price = Number(item.price)

  if (index < sortedArray.length && Number(sortedArray[index].price) === item.price) {
    if (item.size === 0) {
      sortedArray.splice(index, 1)
    } else {
      sortedArray[index].size = item.size
    }
  } else if (item.size !== 0) {
    sortedArray.splice(index, 0, item)
  }

  if (memory_limit != 0 && sortedArray.length > memory_limit) {
    sortedArray.splice(memory_limit, sortedArray.length - memory_limit)
  }
  return index === 0
}

const getSortedIndex = (array: Order[], value: number, inverse: boolean = false) => {

  let low = 0,
    high = array ? array.length : low
  while (low < high) {
    let mid = (low + high) >>> 1
    if ((!inverse && +array[mid].price < +value) || (inverse && +array[mid].price > +value)) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low
}

const cleanOrderbookBid = (array: Order[], order: Order) => {
  for (let i = 0; i < array.length; i++) {
      if (order.price < array[i].price) {
        array.splice(i, 1)
      } else {
        return i
      }
  }
}

const cleanOrderbookAsk = (array: Order[], order: Order) => {
  for (let i = 0; i < array.length; i++) {
      if (order.price > array[i].price) {
        array.splice(i, 1)
      } else {
        return i
      }
  }
}

const processOrderbookUpdate = (data:OrderbookData,ask: Order[], bid: Order[], memory_limit: number,) => {
    for(let order of ask)
    {
      updateIndex(data.ask, order, getSortedIndex(data.ask, order.price, false), memory_limit)
      if (order.price < data.best_bid.price && order.size !== 0) {
        cleanOrderbookBid(data.bid, order)
      }
      data.best_ask = data.ask[0] || {}
    }

    for(let order of bid)
    {
      updateIndex(data.bid, order, getSortedIndex(data.bid, order.price, true), memory_limit)
      if (order.price > data.best_ask.price && order.size !== 0) {
        cleanOrderbookAsk(data.ask, order)
      }
      data.best_bid = data.bid[0] || {}
    }

    data.best_ask = data.ask[0] || {}
    data.best_bid = data.bid[0] || {} 

    return data
}


export class OrderBookStore {
  _data:any = {}
  private memory_limit: number
  _symbols: string[]

  constructor(memory_limit = 0) {
    this._data = {}
    this.memory_limit = memory_limit
    this._symbols = []
  }

  getOrderBook(symbol: string) {
    return this._data[symbol]
  }

  snapshotOrderBook(symbol: string, ask: Order[], bid: Order[]) {
    this._data[symbol] = {
      ask: [],
      bid: [],
      best_ask: {},
      best_bid: {}
    }
    this.updateOrderBook(symbol, ask, bid)
    this._symbols.push(symbol)
  }

  updateOrderBook(symbol: string, ask: Order[], bid: Order[]) {
    const memory_limit = this.memory_limit
    let data = this._data[symbol]

    if (typeof data == "undefined") {
      this.snapshotOrderBook(symbol, ask, bid)
      return
    }

    if (data) {
     data = processOrderbookUpdate(data,ask,bid,memory_limit)
    }
  }
}

export class Orderbook {
  _data:OrderbookData
  protected symbol:string
  private memory_limit:number

  constructor(symbol = "none", memory_limit = 0) {
    this._data = {
      ask: [],
      bid: [],
      best_ask: {},
      best_bid: {}
    }
    this.symbol = symbol
    this.memory_limit = memory_limit
  }

  getOrderBook() {
    return this._data
  }

  updateOrderBook(ask: Order[], bid: Order[]) {
    const memory_limit = this.memory_limit
    let data = this._data

    data = processOrderbookUpdate(data,ask,bid,memory_limit)
    
  }


}


