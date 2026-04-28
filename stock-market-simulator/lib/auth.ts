// lib/auth.ts
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';

export async function getCurrentUser() {
    
    //Read the session cookie

    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    //If no cookie, not logged in
    if (!token) {
        return null;
    }
    
    //look up the session joined to the user.

    const result = await pool.query(
        `SELECT users.user_id, users.email, users.balance
        FROM sessions
        JOIN users on sessions.user_id = users.user_id 
        WHERE sessions.id = $1 AND expires_at > NOW()`, [token]);

    if (result.rows.length === 0) {
        return null;
    }
    else {
        return result.rows[0];
    }
}