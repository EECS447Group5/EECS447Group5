import Link from "next/link";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-black py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

        <nav className="flex gap-1 border-b border-gray-200 mb-6">
          <Link
            href="/portfolio"
            className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/portfolio/history"
            className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            History
          </Link>
        </nav>

        {children}
      </div>
    </div>
  );
}