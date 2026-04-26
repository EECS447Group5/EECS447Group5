import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

interface StockData {
    ticker: string;
    date: string;
    close: number;
    high: number;
    low: number;
    open: number;
    volume: number;
    adjClose: number;
    adjHigh: number;
    adjLow: number;
    adjOpen: number;
    adjVolume: number;
    divCash: number;
    splitFactor: number;
    companyName: string;
    dailyChange: number;
    dailyChangePercent: number;
}

interface CompanyInfo {
    ticker: string;
    company: string;
}

async function getTiingoStatus() {
    const tickers = "aapl,msft,googl,amzn,nvda,tsla,meta";
    const companyInfo: CompanyInfo[] = [
    { ticker: "aapl", company: "Apple Inc." },
    { ticker: "msft", company: "Microsoft Corporation" },
    { ticker: "googl", company: "Alphabet Inc." },
    { ticker: "amzn", company: "Amazon.com, Inc." },
    { ticker: "nvda", company: "NVIDIA Corporation" },
    { ticker: "tsla", company: "Tesla, Inc." },
    { ticker: "meta", company: "Meta Platforms, Inc." }
    ];
    const url = `https://api.tiingo.com/tiingo/daily/prices?tickers=${tickers}&token=${process.env.API_KEY}`;

    try {
        const res = await fetch(url, { next: { revalidate: 0 } });
        if (!res.ok) throw new Error(`Tiingo error: ${res.status}`);

        const data: StockData[] = await res.json();

        const processedStocks = data.map(stock => {
            const dollarChange = stock.adjClose - stock.open;
            const percentageChange = (dollarChange / stock.open) * 100;
            const companyName = companyInfo.find(c => c.ticker === stock.ticker)?.company || stock.ticker.toUpperCase();
            
            return {
            ...stock,
            companyName: companyName,
            dailyChange: dollarChange,
            dailyChangePercent: percentageChange
            };
        });

        return { success: true, stocks: processedStocks };
    } catch (err) {
        return { 
            success: false, 
            error: err instanceof Error ? err.message : "Unknown API Error", 
            stocks: [] 
        };
    }
}

async function updateStocksToDB(stocks: StockData[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
            for (const stock of stocks) {
                await client.query(`
                INSERT INTO stocks (ticker, company_name, current_price, daily_change, daily_change_percent, last_updated)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
                ON CONFLICT (ticker)
                DO UPDATE SET
                    company_name = EXCLUDED.company_name,
                    current_price = EXCLUDED.current_price,
                    daily_change = EXCLUDED.daily_change,
                    daily_change_percent = EXCLUDED.daily_change_percent,
                    last_updated = EXCLUDED.last_updated;
                `, [stock.ticker.toUpperCase(), stock.companyName, stock.adjClose, stock.dailyChange, stock.dailyChangePercent]);
            }
        await client.query('COMMIT');
        console.log("Stock data updated in stocks table");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error updating stocks table: ", err);
    } finally {
        client.release();
    }
}

export async function GET(request: Request) {
    try {
        const auth_token = request.headers.get('authorization');
        if (auth_token !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const stockStatus = await getTiingoStatus();
        if (stockStatus.success) {
        await updateStocksToDB(stockStatus.stocks);
        return NextResponse.json({ message: 'Stock data updated successfully' });
        } else {
        return NextResponse.json({ error: stockStatus.error }, { status: 500 });
        }
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown API Error" }, { status: 500 });
    }
}