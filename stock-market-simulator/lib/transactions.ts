import { pool } from './db';

interface TransactionData {
    transaction_id: number;
    user_id: number;
    ticker: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price_at_trade: number;
    trade_date: Date;
}

export async function getTransactions(user_id: number) {
    try {
        const res = await pool.query(`
            SELECT transaction_id, user_id, ticker, type, quantity, price_at_trade, trade_date
            FROM transactions
            WHERE user_id = $1
            ORDER BY transaction_id ASC;
            `, [user_id]);
        const data: TransactionData[] = res.rows.map(row => ({
            transaction_id: row.transaction_id,
            user_id: row.user_id,
            ticker: row.ticker,
            type: row.type,
            quantity: row.quantity,
            price_at_trade: row.price_at_trade,
            trade_date: row.trade_date
        }));
        return data;
    } catch (err) {
        console.error("Error fetching market data from DB: ", err);
        throw err;
    }
}