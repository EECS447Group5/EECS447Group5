'use server'

import { pool } from './db';

export async function sellStock(user_id: number, ticker: string, quantity: number, price_at_trade: number) {
    try {
        await pool.query('BEGIN');
        await pool.query(`
            INSERT INTO transactions (user_id, stock_id, type, quantity, price_at_trade, trade_date)
            VALUES ($1, (SELECT stock_id FROM stocks WHERE ticker = $2), 'SELL', $3, $4, CURRENT_TIMESTAMP);
            `, [user_id, ticker, quantity, price_at_trade]);
        const res = await pool.query(`
            SELECT quantity
            FROM holdings
            WHERE user_id = $1 AND stock_id = (SELECT stock_id FROM stocks WHERE ticker = $2);
            `, [user_id, ticker]);
        if (res.rows[0].quantity === quantity) {
            await pool.query(`
                DELETE FROM holdings
                WHERE user_id = $1 AND stock_id = (SELECT stock_id FROM stocks WHERE ticker = $2);
                `, [user_id, ticker]);
        }
        else {
            await pool.query(`
                UPDATE holdings
                SET quantity = quantity - $1
                WHERE user_id = $2 AND stock_id = (SELECT stock_id FROM stocks WHERE ticker = $3);
                `, [quantity, user_id, ticker]);
        }
        await pool.query(`
            UPDATE users
            SET balance = balance + $1
            WHERE user_id = $2;
        `, [quantity * price_at_trade, user_id]);
        await pool.query('COMMIT');
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error selling stock: ", err);
        throw err;
    }
}