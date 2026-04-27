// app/(main)/portfolio/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { getHoldingsForUser } from '@/lib/holdings';

export default async function PortfolioPage() {
    const user = await getCurrentUser();
    if (!user) {
        return <div>Not logged in</div>;
    }

    const holdings = await getHoldingsForUser(user.user_id);

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Portfolio</h1>

            {holdings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                    You don&apos;t own any stocks yet.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticker</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Shares</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily Change</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {holdings.map(h => {
                                const change = Number(h.daily_change_percent);
                                return (
                                    <tr key={h.ticker} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{h.ticker}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{h.company_name}</td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-900">{h.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-900">${Number(h.current_price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">${Number(h.value).toFixed(2)}</td>
                                        <td className={`px-4 py-3 text-sm text-right font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}