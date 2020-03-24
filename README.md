# Orderbook Synchronizer

This package allow you to keep update your Orderbook snapshot from a given Websocket source of Orders.

**Features:**

- Orderbook size limit available to avoid overgrow
- Lightweight / No dependency
- Handle Bid/Ask overlaps, best Ask always higher or equal with best Bids

**Orderbook output sample(`.getOrderBook()`):**

```
{
      ask: [
        { price: 8000, size: 1.9869372781826433 },
        { price: 8001, size: 0.6590219188159661 },
        { price: 8002, size: 1.0430790809329253 },
        { price: 8003, size: 0.12794162550163035 },
        { price: 8004, size: 1.3397780002928084 },
        { price: 8005, size: 1.8250517469118535 },
      ],
      bid: [
        { price: 6020, size: 1.5764351751676466 },
        { price: 6019, size: 1.9678679870588733 },
        { price: 6018, size: 1.7349295266546774 },
        { price: 6017, size: 1.0087743314824977 },
        { price: 6016, size: 0.09423390709772583 },
      ],
      best_ask: { price: 8000, size: 1.9869372781826433 },
      best_bid: { price: 6020, size: 1.5764351751676466 }
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
OrderBooks.updateOrderBook('BTC/USD', ask: Order[], bid: Order[]); // Create/Update Orderbook
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
SingleOrderBook.updateOrderBook(ask: Order[], bid: Order[]); // Update Orderbook
```

**Original inspiration source:**

- https://gist.github.com/hitbtc-com/fc738c1b926d9d7aa7e3bd5247f792a1
