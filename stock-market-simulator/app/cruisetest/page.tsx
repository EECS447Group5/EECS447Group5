import { sql } from '@/lib/db';

interface Cruise {
  cruisenum: string;
  startdate: Date | string | null;
  enddate: Date | string | null;
  director: string | null;
  shipnum: string | null;
}

export default async function CruisePage() {
  try {
    const rows = await sql`SELECT * FROM CRUISE;` as Cruise[];

    if (!rows || rows.length === 0) {
      return <div style={{ padding: '20px' }}>No cruises found in the database.</div>;
    }

    const headers = Object.keys(rows[0]);

    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
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