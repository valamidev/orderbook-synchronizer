export interface Order {
    price: number;
    size: number;
}


export interface OrderbookData {
    ask: Order[],
    bid: Order[],
    best_ask: any,
    best_bid: any
}

