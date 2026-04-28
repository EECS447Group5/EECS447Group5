// app/(main)/portfolio/layout.tsx
import { getCurrentUser } from "@/lib/auth";
import { getHoldingsForUser } from "@/lib/holdings";
import PortfolioTabs from "@/app/components/PortfolioTabs";

const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) return <div>Not logged in</div>;

    const holdings = await getHoldingsForUser(user.user_id);
    const cash = Number(user.balance);
    const holdingsValue = holdings.reduce((sum, h) => sum + Number(h.value), 0);
    const total = cash + holdingsValue;

    return (
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-baseline gap-3 mb-2">
                    <h1 className="text-3xl font-bold">Portfolio</h1>
                    <div className="text-3xl font-bold text-gray-700">
                        {fmt.format(total)}
                    </div>
                </div>

                <div className="flex gap-6 text-base text-gray-600 mb-6">
                    <span>
                        Cash <span className="font-semibold text-gray-900">{fmt.format(cash)}</span>
                    </span>
                    <span>
                        Stocks <span className="font-semibold text-gray-900">{fmt.format(holdingsValue)}</span>
                    </span>
                </div>

                <PortfolioTabs />

                {children}
            </div>
        </div>
    );
}