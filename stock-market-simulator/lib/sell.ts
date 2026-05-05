'use server'

import { pool } from './db';

export async function sellStock(user_id: number, ticker: string, quantity: number, price_at_trade: number) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`
            INSERT INTO transactions (user_id, stock_id, type, quantity, price_at_trade, trade_date)
            VALUES ($1, (SELECT stock_id FROM stocks WHERE ticker = $2), 'SELL', $3, $4, CURRENT_TIMESTAMP);
            `, [user_id, ticker, quantity, price_at_trade]);
        const res = await client.query(`
            SELECT quantity
            FROM holdings
            WHERE user_id = $1 AND stock_id = (SELECT stock_id FROM stocks WHERE ticker = $2);
            `, [user_id, ticker]);
        if (res.rows[0].quantity === quantity) {
            await client.query(`
                DELETE FROM holdings
                WHERE user_id = $1 AND stock_id = (SELECT stock_id FROM stocks WHERE ticker = $2);
                `, [user_id, ticker]);
        }
        else {
            await client.query(`
                UPDATE holdings
                SET quantity = quantity - $1
                WHERE user_id = $2 AND stock_id = (SELECT stock_id FROM stocks WHERE ticker = $3);
                `, [quantity, user_id, ticker]);
        }
        await client.query(`
            UPDATE users
            SET balance = balance + $1
            WHERE user_id = $2;
        `, [quantity * price_at_trade, user_id]);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error selling stock: ", err);
        throw err;
    } finally {
        client.release();
    }
}
