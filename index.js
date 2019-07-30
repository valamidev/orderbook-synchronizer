function updateIndex(sortedArray, item, index) {
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
  constructor() {
    this._data = {}
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
    const data = this._data[symbol.toString()]

    if (typeof data == "undefined") {
      this.snapshotOrderBook(symbol, ask, bid)
      return
    }

    if (data) {
      ask.forEach(function(v) {
        Number(v.price)
        updateIndex(data.ask, v, getSortedIndex(data.ask, v.price))
      })
      bid.forEach(function(v) {
        Number(v.price)
        updateIndex(data.bid, v, getSortedIndex(data.bid, v.price, true))
      })
    }
  }

  /*
  repairOrderbook(symbol) {
    const data = this._data[symbol.toString()]

    while (data.ask[0].price < data.bid[0].price) {
      console.log(data.ask[0].price, data.bid[0].price)
      data.ask.shift()
    }
  }*/
}

module.exports = OrderBookStore
