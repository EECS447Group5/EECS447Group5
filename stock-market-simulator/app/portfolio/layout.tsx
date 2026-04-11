import Link from "next/link";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <Link href="/portfolio">Overview</Link>
        <Link href="/portfolio/history">History</Link>
      </nav>
      {children}
    </div>
  );
}