import Link from "next/link"
import { getMarketData } from "@/lib/stocks";

export default async function TradePage() {
    const stocks = await getMarketData();
    return (
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Trade</h1>

                <ul className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-200 overflow-hidden">
                    {stocks.map((stock) => {
                        const isPositive = stock.daily_change > 0;
                        const isNegative = stock.daily_change < 0;
                        const changeColor = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500";
                        return (
                            <li key={stock.ticker}>
                                <Link
                                    href={`/trade/${stock.ticker}`}
                                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">
                                            {stock.ticker}
                                        </span>
                                        <span className="text-gray-600">
                                            {stock.company_name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">
                                            ${stock.current_price.toFixed(2)}
                                        </div>
                                        <div className={`text-sm font-medium ${changeColor}`}>
                                            {isPositive ? '+' : '-'}${Math.abs(stock.daily_change).toFixed(2)} ({(stock.daily_change_percent).toFixed(2)}%)
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}