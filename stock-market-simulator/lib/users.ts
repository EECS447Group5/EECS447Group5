import { pool } from './db';
import { getCurrentUser } from './auth';

interface UserData {
    user_id: number;
    email: string;
    balance: number;
}

export async function getBalance() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("User not logged in");
    }
    try {
        const res = await pool.query(`
            SELECT balance
            FROM users
            WHERE user_id = $1;
        `, [user.user_id]);
        return parseFloat(res.rows[0].balance);
    } catch (err) {
        console.error("Error fetching balance from DB: ", err);
        throw err;
    }
}