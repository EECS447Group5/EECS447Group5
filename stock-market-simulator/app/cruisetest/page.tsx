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
  close: number;
  last: number; // Some Tiingo endpoints use 'last' instead of 'close'
  prevClose: number;
}

async function getTiingoStatus() {
  // Use a comma-separated list of tickers
  const tickers = "aapl,msft,googl,amzn,nvda,tsla,meta";
  const url = `https://api.tiingo.com/tiingo/daily/prices?tickers=${tickers}&token=${process.env.API_KEY}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Tiingo error: ${res.status}`);
    
    const data: StockData[] = await res.json();
    
    // Return the whole array so you can map over it in your UI
    return { success: true, stocks: data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown API Error", stocks: [] };
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
        <section style={{ 
          marginBottom: '30px', 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: stockStatus.success ? '#000000' : '#fff5f5' 
        }}>
          <h2>Market Watch (Tiingo Multi-Ticker Test)</h2>
          
          {stockStatus.success ? (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
              {stockStatus.stocks.map((stock) => (
                <li key={stock.ticker} style={{ padding: '10px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#000000' }}>
                  <strong>{stock.ticker}</strong>: 
                  <span style={{ color: '#2f855a', marginLeft: '5px' }}>
                    ${stock.close || stock.last}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#c53030' }}><strong>Failed:</strong> {stockStatus.error}</p>
          )}
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