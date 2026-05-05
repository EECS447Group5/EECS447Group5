'use server'

import { pool } from './db';

export async function buyStock(user_id: number, ticker: string, quantity: number, price_at_trade: number) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const res = await client.query(`
            INSERT INTO transactions (user_id, stock_id, type, quantity, price_at_trade, trade_date)
            VALUES ($1, (SELECT stock_id FROM stocks WHERE ticker = $2), 'BUY', $3, $4, CURRENT_TIMESTAMP)
            RETURNING transaction_id;
        `, [user_id, ticker, quantity, price_at_trade]);
        await client.query(`
            INSERT INTO holdings (user_id, stock_id, quantity)
            VALUES ($1, (SELECT stock_id FROM stocks WHERE ticker = $2), $3)
            ON CONFLICT (user_id, stock_id)
            DO UPDATE SET
                quantity = holdings.quantity + EXCLUDED.quantity
                `, [user_id, ticker, quantity]);
        await client.query(`
            UPDATE users
            SET balance = balance - $1
            WHERE user_id = $2;
        `, [quantity * price_at_trade, user_id]);
        await client.query('COMMIT');
        return res.rows[0].transaction_id;
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error buying stock: ", err);
        throw err;
    } finally {
        client.release();
    }
}
