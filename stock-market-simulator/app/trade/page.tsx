import Link from "next/link"

const stocks = [
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "MSFT", name: "Microsoft Corporation" },
    { ticker: "GOOGL", name: "Alphabet Inc." },
    { ticker: "AMZN", name: "Amazon.com Inc." },
    { ticker: "NVDA", name: "NVIDIA Corporation" },
    { ticker: "TSLA", name: "Tesla Inc." },
    { ticker: "META", name: "Meta Platforms Inc." },
];

export default function TradePage() {
    return (
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Trade</h1>

                <ul className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-200 overflow-hidden">
                    {stocks.map((stock) => (
                        <li key={stock.ticker}>
                            <Link
                                href={`/trade/${stock.ticker}`}
                                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-900">
                                    {stock.ticker}
                                </span>
                                <span className="text-gray-600">
                                    {stock.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}