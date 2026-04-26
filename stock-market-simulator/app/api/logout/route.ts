import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';

export async function POST() {
    // 1. Read the session cookie (same pattern as getCurrentUser)

    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    // 2. If there is one, DELETE the row from sessions
    if (token) {
            await pool.query(
            `DELETE FROM sessions
            WHERE id = $1`,
            [token]
        );
    }

    // 3. Build a response
    const response = NextResponse.json({ success: true });

    // 4. Clear the cookie on that response
    response.cookies.delete('session');
    // 5. Return
    return response;
}