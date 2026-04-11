import BuyForm from "./BuyForm";


export default async function StockDetailPage({
    params,
}: {
    params: Promise<{ ticker: string }>
}) {
    const { ticker } = await params;
    return (
        <div>
        <h1>Stock Detail : { ticker }</h1>
        <BuyForm ticker = {ticker} />
        </div>
    );
}