import Link from "next/link"

const stocks = [
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "MSFT", name: "Microsoft Corporation" },
    {ticker: "GOOGL", name: "Alphabet Inc." },
    {ticker: "AMZN", name: "Amazon.com Inc." },
    { ticker: "NVDA", name: "NVIDIA Corporation" },
    { ticker: "TSLA", name: "Tesla Inc." },
    { ticker: "META", name: "Meta Platforms Inc." },
];

export default function TradePage() {
    return (
    
        <div>
            <h1>Trade</h1>
            <ul>
                {stocks.map((stock) => (
                    <li key={stock.ticker}>
                        <Link href={`/trade/${stock.ticker}`}>
                            {stock.ticker} - {stock.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}