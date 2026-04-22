'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
            Log Out
        </button>
    );
}