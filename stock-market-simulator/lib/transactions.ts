import { pool } from './db';

interface TransactionData {
    transaction_id: number;
    user_id: number;
    ticker: string;
    type: 'buy' | 'sell';
    quantity: number;
    price_at_trade: number;
    trade_date: Date;
}