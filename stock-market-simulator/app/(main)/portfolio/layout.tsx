// app/(main)/portfolio/layout.tsx
import { getCurrentUser } from "@/lib/auth";
import PortfolioTabs from "@/app/components/PortfolioTabs";

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) return <div>Not logged in</div>;

    return (
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-baseline gap-3 mb-6">
                <h1 className="text-3xl font-bold">Portfolio</h1>
                <div className="text-3xl font-bold text-gray-700">
                    ${Number(user.balance).toFixed(2)}
                </div>
            </div>

                <PortfolioTabs />

                {children}
            </div>
        </div>
    );
}