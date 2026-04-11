import { pool } from '@/lib/db';

export default async function CruisePage() {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM CRUISE');

        return (
            <div>
                <h1>CRUISE Table</h1>
                <table>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, idx) => (
                                    <td key={idx}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } catch (error) {
        return <p>Could not connect: {error.message}</p>
    }
}