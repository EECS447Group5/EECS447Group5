// app/(main)/portfolio/history/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { getHistoryForUser } from '@/lib/history';

export default async function HistoryPage() {
    const user = await getCurrentUser();
    if (!user) {
        return <div>Not logged in</div>;
    }

    const history = await getHistoryForUser(user.user_id);

    return (
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

                {history.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center text-gray-500">
                        You don&apos;t have any transactions yet.
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Ticker</th>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Shares</th>
                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {history.map((t, i) => {
                                    const isBuy = t.type === 'BUY';
                                    const typeColor = isBuy ? 'text-green-600' : 'text-red-600';
                                    const date = new Date(t.trade_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                    return (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-gray-700">{date}</td>
                                            <td className={`px-5 py-4 font-semibold ${typeColor}`}>{t.type}</td>
                                            <td className="px-5 py-4 font-semibold text-gray-900">{t.ticker}</td>
                                            <td className="px-5 py-4 text-gray-600">{t.company_name}</td>
                                            <td className="px-5 py-4 text-right text-gray-900">{t.quantity}</td>
                                            <td className="px-5 py-4 text-right text-gray-900">${Number(t.price_at_trade).toFixed(2)}</td>
                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">${Number(t.total).toFixed(2)}</td>
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