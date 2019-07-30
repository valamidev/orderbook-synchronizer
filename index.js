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
    sortedArray.pop()
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

class OrderBookStore {
  constructor(memory_limit = 0) {
    this._data = {}
    this.memory_limit = memory_limit
  }

  getOrderBook(symbol) {
    return this._data[symbol.toString()]
  }

  snapshotOrderBook(symbol, ask, bid) {
    this._data[symbol.toString()] = {
      ask: [],
      bid: []
    }
    this.updateOrderBook(symbol, ask, bid)
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
      })
      bid.forEach(function(v) {
        Number(v.price)
        updateIndex(data.bid, v, getSortedIndex(data.bid, v.price, true), memory_limit)
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
