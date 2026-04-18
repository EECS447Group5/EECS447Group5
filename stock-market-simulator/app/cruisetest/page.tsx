import { sql } from '@/lib/db';

interface Cruise {
  cruisenum: string;
  startdate: Date | string | null;
  enddate: Date | string | null;
  director: string | null;
  shipnum: string | null;
}

// 1. Define a type for the multi-stock response
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
  // Note: Ensure your .env variable matches the name used here (e.g., API_KEY)
  const url = `https://api.tiingo.com/tiingo/daily/prices?tickers=${tickers}&token=${process.env.API_KEY}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Tiingo error: ${res.status}`);
    
    const data: StockData[] = await res.json();
    
    // Calculate the daily change for each stock
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

export default async function CruisePage() {
  try {
    // Run both fetches
    const [rawRows, stockStatus] = await Promise.all([
      sql`SELECT * FROM CRUISE;`,
      getTiingoStatus()
    ]);

    const rows = rawRows as unknown as Cruise[];

    if (!rows || rows.length === 0) {
      return <p>No data found.</p>;
    }

    const headers: string[] = Object.keys(rows[0]);

    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Market Watch</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
            {stockStatus.stocks.map((stock: StockData) => (
              <div key={stock.ticker} style={{ padding: '10px', border: '1px solid #eee' }}>
                <strong>{stock.ticker.toUpperCase()}</strong>
                <div>${stock.adjClose.toFixed(2)}</div>
                <div style={{ color: stock.dailyChange >= 0 ? 'green' : 'red' }}>
                  {stock.dailyChange >= 0 ? '+' : ''}{stock.dailyChange.toFixed(2)} 
                  ({stock.dailyChangePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </section>
          <h1>Cruise Schedule</h1>
          <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead style={{ backgroundColor: '#000000' }}>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>
                      {value instanceof Date 
                        ? value.toLocaleDateString() 
                        : value?.toString() || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Showing {rows.length} total cruises.
          </p>
        </div>
      );
  } catch (error) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return <p style={{ color: 'red', padding: '20px' }}>Database Error: {msg}</p>;
  }
}