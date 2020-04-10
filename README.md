# Orderbook Synchronizer

[![DeepScan grade](https://deepscan.io/api/teams/6761/projects/8876/branches/113562/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6761&pid=8876&bid=113562)
[![npm](https://img.shields.io/npm/v/orderbook-synchronizer)](https://www.npmjs.com/package/orderbook-synchronizer)
[![npm](https://img.shields.io/npm/dy/orderbook-synchronizer)](https://www.npmjs.com/package/orderbook-synchronizer)
[![Coverage Status](https://coveralls.io/repos/github/valamidev/orderbook-synchronizer/badge.svg)](https://coveralls.io/github/valamidev/orderbook-synchronizer)

This package allow you to keep update your Orderbook snapshot from a given Websocket source of Orders.

**Features:**

- Orderbook size limit available to avoid overgrow
- Lightweight / No dependency
- Handle Bid/Ask overlaps, best Ask always higher or equal with best Bids

**Orderbook output sample(`.getOrderBook()`):**

```
{
      asks: [
        [8000, 1.9869372781826433],
        [8001, 0.6590219188159661],
        [8002, 1.0430790809329253],
        [8003, 0.1279416255016304],
        [8004, 1.3397780002928084],
        [8005, 1.8250517469118535],
      ],
      bids: [
        [6020, 1.5764351751676466],
        [6019, 1.9678679870588733],
        [6018, 1.7349295266546774],
        [6017, 1.0087743314824977],
        [6016, 0.0942339070977258],
      ]
}
```

**Imports:**

```
import {OrderBookStore} from 'orderbook-synchronizer'; // Multiple OrderBooks in a single class
import {Orderbook} from 'orderbook-synchronizer'; // Single OrderBook
```

## Available methods(OrderBookStore):

#### Constructor:

```
const OrderBooks = new OrderBookStore(1000); // Set memory limit / maximum length of Ask/Bid array
```

#### updateOrderBook:

```
OrderBooks.updateOrderBook('BTC/USD', asks: Order[], bids: Order[]); // Create/Update Orderbook
```

#### hasOrderBook:

```
OrderBooks.hasOrderBook('BTC/USD'); // return boolean if Orderbook exist
```

#### getOrderBook:

```
OrderBooks.getOrderBook('BTC/USD'); // return Orderbook | undefined depends on Orderbook exist
```

#### getSymbolList:

```
OrderBooks.getSymbolList(); // return all Orderbook keys in array ['BTC/USD']
```

## Available methods(Orderbook):

#### Constructor:

```
const SingleOrderBook = new Orderbook(1000); // Set memory limit / maximum length of Ask/Bid array
```

#### getOrderBook:

```
SingleOrderBook.getOrderBook(); // return Orderbook
```

#### updateOrderBook:

```
SingleOrderBook.updateOrderBook(asks: Order[], bids: Order[]); // Update Orderbook
```

**Original inspiration source:**

- https://gist.github.com/hitbtc-com/fc738c1b926d9d7aa7e3bd5247f792a1
