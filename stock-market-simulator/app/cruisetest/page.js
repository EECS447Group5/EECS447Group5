import { sql } from '@/lib/db';

export default async function CruisePage() {
    try {
        const rows = await sql`SELECT * FROM CRUISE;`;

        if (!rows || rows.length === 0) {
            return <p>No data found.</p>;
        }

        const columnNames = Object.keys(rows[0]);

        return (
            <div style={{ padding: '20px' }}>
                <h1>CRUISE Table (Neon/Postgres)</h1>
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {columnNames.map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, idx) => (
                                    <td key={idx}>{value !== null ? String(value) : ""}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } catch (error) {
        console.error(error);
        return <p style={{ color: 'red' }}>Database Error: {error.message}</p>;
    }
}