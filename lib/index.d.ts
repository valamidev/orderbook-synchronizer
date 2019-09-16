import { Order, OrderbookData } from "./interfaces";
export declare class OrderBookStore {
    _data: any;
    private memory_limit;
    _symbols: string[];
    constructor(memory_limit?: number);
    getOrderBook(symbol: string): any;
    snapshotOrderBook(symbol: string, ask: Order[], bid: Order[]): void;
    updateOrderBook(symbol: string, ask: Order[], bid: Order[]): void;
}
export declare class Orderbook {
    _data: OrderbookData;
    protected symbol: string;
    private memory_limit;
    constructor(symbol?: string, memory_limit?: number);
    getOrderBook(): OrderbookData;
    updateOrderBook(ask: Order[], bid: Order[]): void;
}
