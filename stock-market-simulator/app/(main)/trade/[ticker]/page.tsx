import Link from "next/link";
import BuyForm from "./BuyForm";

export default async function StockDetailPage({
    params,
}: {
    params: Promise<{ ticker: string }>
}) {
    const { ticker } = await params;
    return (
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/trade"
                    className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
                >
                    ← Back to all stocks
                </Link>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Ticker
                    </p>
                    <h1 className="text-4xl font-bold mb-6">{ticker}</h1>

                    <BuyForm ticker={ticker} />
                </div>
            </div>
        </div>
    );
}