export default async function StockDetailPage({
    params,
}: {
    params: Promise<{ ticker: string }>
}) {
    const { ticker } = await params;
    return <h1>Stock Detail : { ticker }</h1>;
}