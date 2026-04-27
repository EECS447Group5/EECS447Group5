import Link from "next/link";
import BuyForm from "./BuyForm";
import { getStockData } from "@/lib/stocks";

export default async function StockDetailPage({
    params,
}: {
    params: Promise<{ ticker: string }>
}) {
    const { ticker } = await params;
    const stockData = await getStockData(ticker);
    const isPositive = stockData[0].daily_change > 0;
    const isNegative = stockData[0].daily_change < 0;
    const changeColor = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-900";
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
                    <h1 className="text-4xl font-bold mb-6">{stockData[0].ticker}</h1>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Company Name
                    </p>
                    <h2 className="text-2xl font-semibold mb-4">{stockData[0].company_name}</h2>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Current Price
                    </p>
                    <h3 className="text-3xl font-bold mb-6">${stockData[0].current_price.toFixed(2)}</h3>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Today's Gain/Loss
                    </p>
                    <h4 className={`text-2xl font-semibold mb-4 ${changeColor}`}>
                        {isPositive ? '+' : ''}{stockData[0].daily_change.toFixed(2)} ({stockData[0].daily_change_percent.toFixed(2)}%)
                    </h4>

                    <BuyForm ticker={ticker} />
                </div>
            </div>
        </div>
    );
}