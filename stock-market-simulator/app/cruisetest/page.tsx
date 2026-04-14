import { sql } from '@/lib/db';

interface Cruise {
  cruisenum: string;
  startdate: Date | string | null;
  enddate: Date | string | null;
  director: string | null;
  shipnum: string | null;
}

// 1. New function to test Tiingo
async function getTiingoStatus() {
  const ticker = "aapl";
  const url = `https://api.tiingo.com/tiingo/daily/${ticker}/prices?token=${process.env.API_KEY}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!res.ok) throw new Error(`Tiingo error: ${res.status}`);
    const data = await res.json();
    return { success: true, price: data[0].close, ticker: ticker.toUpperCase() };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown API Error" };
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
        {/* --- TIINGO TEST SECTION --- */}
        <section style={{ 
          marginBottom: '30px', 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: stockStatus.success ? '#f0fff4' : '#fff5f5' 
        }}>
          <h2>Tiingo API Test</h2>
          {stockStatus.success ? (
            <p style={{ color: '#2f855a' }}>
              <strong>Connected!</strong> Last closing price for <strong>{stockStatus.ticker}</strong>: ${stockStatus.price}
            </p>
          ) : (
            <p style={{ color: '#c53030' }}>
              <strong>Failed:</strong> {stockStatus.error}
            </p>
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