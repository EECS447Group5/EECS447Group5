import { sql } from '@/lib/db';

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
  dailyChange: number;
  dailyChangePercent: number;
}

async function getTiingoStatus() {
  const tickers = "aapl,msft,googl,amzn,nvda,tsla,meta";
  const url = `https://api.tiingo.com/tiingo/daily/prices?tickers=${tickers}&token=${process.env.API_KEY}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Tiingo error: ${res.status}`);
    
    const data: StockData[] = await res.json();

    const processedStocks = data.map(stock => {
      const dollarChange = stock.adjClose - stock.open;
      const percentageChange = (dollarChange / stock.open) * 100;
      
      return {
        ...stock,
        dailyChange: dollarChange,
        dailyChangePercent: percentageChange
      };
    });

    console.log("Processed Stock Data:", processedStocks);
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
  try {
    for (const stock of stocks) {
      await sql`
        INSERT INTO "Stock" (ticker, company_name, current_price, last_updated)
        VALUES (${stock.ticker.toUpperCase()}, ${stock.ticker.toUpperCase()}, ${stock.adjClose}, CURRENT_TIMESTAMP)
        ON CONFLICT (ticker)
        DO UPDATE SET
          company_name = EXCLUDED.company_name,
          current_price = EXCLUDED.current_price,
          last_updated = EXCLUDED.last_updated;
      `;
    }
    console.log("Stock data updated in Stock table")
  } catch (err) {
    console.error("Error updating Stock table: ", err);
  }
}

export default async function StockDashboard() {
  const stockStatus = await getTiingoStatus();
  if (stockStatus.success) {
    await updateStocksToDB(stockStatus.stocks);
  }
  const dbStocks = await sql`SELECT * FROM "Stock" ORDER BY ticker ASC`;
  return (
    <div style={{ padding: '20px' }}>
      <h1>Stock Simulator Database</h1>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Price</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {dbStocks.map((s) => (
            <tr key={s.stock_id}>
              <td>{s.ticker}</td>
              <td>${Number(s.current_price).toFixed(2)}</td>
              <td>{new Date(s.last_updated).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}