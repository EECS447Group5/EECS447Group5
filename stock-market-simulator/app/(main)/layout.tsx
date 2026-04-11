import Link from "next/link";

export default function MainLayout({ children }: {children: React.ReactNode }) {
    return (
        <>
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-gray-900">
                    Stock Sim
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/trade" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Trade
                    </Link>
                    <Link href="/portfolio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Portfolio
                    </Link>
                    <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Login
                    </Link>
                </div>
                </div>
            </nav>
            {children}
        </>
    )
}
