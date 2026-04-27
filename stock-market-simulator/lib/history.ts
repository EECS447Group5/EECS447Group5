// lib/holdings.ts
import { pool } from '@/lib/db';

export async function getHistoryForUser(userId: number) {
    const result = await pool.query(
        `SELECT 
            t.trade_date,
            t.type,
            s.ticker,
            s.company_name,
            t.quantity,
            t.price_at_trade,
            t.quantity * t.price_at_trade AS total
        FROM transactions t
        JOIN stocks s ON t.stock_id = s.stock_id
        WHERE t.user_id = $1
        ORDER BY t.trade_date DESC`
         ,
        [userId]
    );
    return result.rows;
}