import Link from "next/link";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";
import { getStockData } from "@/lib/stocks";
import { getCurrentUser } from "@/lib/auth";
import { getUserData } from "@/lib/users";
import { getHoldingQuantity } from "@/lib/holdings";

export default async function StockDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ ticker: string }>
    searchParams: Promise<{ action?: string }>
}) {
    const { ticker } = await params;
    const { action } = await searchParams;
    const stockData = await getStockData(ticker);
    const currentUser = await getCurrentUser();

    let user = null;
    let quantity_owned = 0;
    if (currentUser) {
        user = await getUserData();
        quantity_owned = await getHoldingQuantity(user.user_id, ticker);
    }

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
                        Today&apos;s Gain/Loss
                    </p>
                    <h4 className={`text-2xl font-semibold mb-4 ${changeColor}`}>
                        {isPositive ? '+' : '-'}${Math.abs(stockData[0].daily_change).toFixed(2)} ({(stockData[0].daily_change_percent).toFixed(2)}%)
                    </h4>

                    {user ? (
                        <>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Action
                            </p>
                            <div className="flex gap-4 mb-8">
                                <Link
                                    href={`/trade/${ticker}?action=buy`}
                                    className={`rounded-md py-2 px-6 transition-colors ${
                                        action === 'buy' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Buy
                                </Link>
                                <Link
                                    href={`/trade/${ticker}?action=sell`}
                                    className={`rounded-md py-2 px-6 transition-colors ${
                                        action === 'sell' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Sell
                                </Link>
                            </div>

                            {action === 'buy' && <BuyForm ticker={ticker} user={user} price={stockData[0].current_price} />}
                            {action === 'sell' && <SellForm ticker={ticker} user={user} price={stockData[0].current_price} quantity_owned={quantity_owned}/>}

                            {!action && <p className="text-gray-500 italic">Select an action to trade</p>}
                        </>
                    ) : (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <Link href="/login" className="text-blue-700 font-medium hover:underline">
                                Log in to buy or sell this stock →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
