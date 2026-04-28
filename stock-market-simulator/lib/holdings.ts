// lib/holdings.ts
import { pool } from '@/lib/db';

export async function getHoldingQuantity(userId: number, ticker: string) {
    const result = await pool.query(
        `SELECT h.quantity
         FROM holdings h
         JOIN stocks s ON h.stock_id = s.stock_id
         WHERE h.user_id = $1 AND s.ticker = $2`,
        [userId, ticker]
    );
    return parseFloat(result.rows[0]?.quantity || 0);
}

export async function getHoldingsForUser(userId: number) {
    const result = await pool.query(
        `SELECT s.ticker, s.company_name, s.current_price, s.daily_change_percent, h.quantity,
                h.quantity * s.current_price AS value
         FROM holdings h
         JOIN stocks s ON h.stock_id = s.stock_id
         WHERE h.user_id = $1`,
        [userId]
    );
    return result.rows;
}