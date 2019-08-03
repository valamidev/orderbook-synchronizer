"use strict"

function updateIndex(sortedArray, item, index, memory_limit = 0) {
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

function getSortedIndex(array, value, inverse) {
  inverse = Boolean(inverse)
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

function cleanOrderbookBid(array, item) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].price != "undefinied") {
      if (item.price < array[i].price) {
        array.splice(i, 1)
      } else {
        return i
      }
    }
  }
}

function cleanOrderbookAsk(array, item) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].price != "undefinied") {
      if (item.price > array[i].price) {
        array.splice(i, 1)
      } else {
        return i
      }
    }
  }
}

class OrderBookStore {
  constructor(memory_limit = 0) {
    this._data = {}
    this.memory_limit = memory_limit
    this._symbols = []
  }

  getOrderBook(symbol) {
    return this._data[symbol.toString()]
  }

  snapshotOrderBook(symbol, ask, bid) {
    this._data[symbol.toString()] = {
      ask: [],
      bid: [],
      best_ask: {},
      best_bid: {}
    }
    this.updateOrderBook(symbol, ask, bid)
    this._symbols.push(symbol)
  }

  updateOrderBook(symbol, ask, bid) {
    const memory_limit = this.memory_limit
    const data = this._data[symbol.toString()]

    if (typeof data == "undefined") {
      this.snapshotOrderBook(symbol, ask, bid)
      return
    }

    if (data) {
      ask.forEach(function(v) {
        Number(v.price)
        updateIndex(data.ask, v, getSortedIndex(data.ask, v.price), memory_limit)
        if (v.price < data.best_bid.price) {
          cleanOrderbookBid(data.bid, v)
        }
        data.best_ask = data.ask[0] || {}
      })
      bid.forEach(function(v) {
        Number(v.price)
        updateIndex(data.bid, v, getSortedIndex(data.bid, v.price, true), memory_limit)
        if (v.price > data.best_ask.price) {
          cleanOrderbookAsk(data.ask, v)
        }
        data.best_bid = data.bid[0] || {}
      })
    }
  }
}

class Orderbook {
  constructor(symbol = "none", memory_limit = 0) {
    this._data = {
      ask: [],
      bid: []
    }
    this.symbol = symbol
    this.memory_limit = memory_limit
  }

  getOrderBook() {
    return this._data
  }

  updateOrderBook(ask, bid) {
    const memory_limit = this.memory_limit
    const data = this._data

    if (data) {
      ask.forEach(function(v) {
        Number(v.price)
        updateIndex(data.ask, v, getSortedIndex(data.ask, v.price), memory_limit)
      })
      bid.forEach(function(v) {
        Number(v.price)
        updateIndex(data.bid, v, getSortedIndex(data.bid, v.price, true), memory_limit)
      })
    }
  }
}

module.exports = { OrderBookStore, Orderbook }
