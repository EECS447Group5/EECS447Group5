'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabClass = (href: string) => {
        const isActive = pathname === href;
        return `px-4 py-2 font-medium border-b-2 transition-colors ${
            isActive
                ? "text-blue-600 border-blue-600"
                : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-600"
        }`;
    };

    return (
        <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

                <nav className="flex gap-1 border-b border-gray-200 mb-6">
                    <Link href="/portfolio" className={tabClass("/portfolio")}>
                        Overview
                    </Link>
                    <Link href="/portfolio/history" className={tabClass("/portfolio/history")}>
                        History
                    </Link>
                </nav>

                {children}
            </div>
        </div>
    );
}