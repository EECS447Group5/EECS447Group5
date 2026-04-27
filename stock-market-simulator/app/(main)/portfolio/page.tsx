// app/(main)/portfolio/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { pool } from '@/lib/db';

export default async function PortfolioPage() {
    const user = await getCurrentUser();
    
    // Middleware already redirected non-logged-in users,
    // but this is a safety net + it gives us the user object.
    if (!user) {
        return <div>Not logged in</div>;
    }
    
    const result = await pool.query(
        `SELECT
          s.ticker, 
          s.company_name, 
          s.current_price, 
          s.daily_change_percent, 
          h.quantity,
          h.quantity * s.current_price AS value
        FROM holdings h
        JOIN stocks s ON h.stock_id = s.stock_id
        WHERE h.user_id = $1`,
        [user.user_id]
    );
    
    const holdings = result.rows;
    
    return (
        <div>
            <h1>Your Portfolio</h1>
        <table className="min-w-full">
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Company</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Value</th>
                    <th>Daily Change</th>
                </tr>
            </thead>
            <tbody>
                {holdings.map(h => (
                    <tr key={h.ticker}>
                        <td>{h.ticker}</td>
                        <td>{h.company_name}</td>
                        <td>{h.quantity}</td>
                        <td>${Number(h.current_price).toFixed(2)}</td>
                        <td>${Number(h.value).toFixed(2)}</td>
                        <td>{Number(h.daily_change_percent).toFixed(2)}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}