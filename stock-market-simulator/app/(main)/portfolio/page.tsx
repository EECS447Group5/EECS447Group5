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
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

                {holdings.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center text-gray-500">
                        You don&apos;t own any stocks yet.
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Ticker</th>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Shares</th>
                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Value</th>
                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Daily Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {holdings.map((h) => {
                                    const change = Number(h.daily_change_percent);
                                    const isPositive = change > 0;
                                    const isNegative = change < 0;
                                    const changeColor = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500";
                                    return (
                                        <tr key={h.ticker} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 font-semibold text-gray-900">{h.ticker}</td>
                                            <td className="px-5 py-4 text-gray-600">{h.company_name}</td>
                                            <td className="px-5 py-4 text-right text-gray-900">{h.quantity}</td>
                                            <td className="px-5 py-4 text-right text-gray-900">${Number(h.current_price).toFixed(2)}</td>
                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">${Number(h.value).toFixed(2)}</td>
                                            <td className={`px-5 py-4 text-right text-sm font-medium ${changeColor}`}>
                                                {isPositive ? '+' : ''}{change.toFixed(2)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}