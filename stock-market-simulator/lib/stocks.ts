import { pool } from './db';

interface StockData {
    ticker: string;
    company_name: string;
    current_price: number;
    daily_change: number;
    daily_change_percent: number;
}

export async function getMarketData() {
    try {
        const res = await pool.query(`
            SELECT ticker, company_name, current_price, daily_change, daily_change_percent
            FROM stocks
            ORDER BY ticker ASC;
            `);
        const data: StockData[] = res.rows.map(row => ({
            ticker: row.ticker,
            company_name: row.company_name,
            current_price: parseFloat(row.current_price),
            daily_change: parseFloat(row.daily_change),
            daily_change_percent: parseFloat(row.daily_change_percent)
        }));
        return data;
    } catch (err) {
        console.error("Error fetching stock data from DB: ", err);
        throw err;
    }
}