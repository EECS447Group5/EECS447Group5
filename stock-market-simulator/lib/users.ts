import { pool } from './db';
import { getCurrentUser } from './auth';

export interface UserData {
    user_id: number;
    email: string;
    balance: number;
}

export async function getUserData() {
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
        const data: UserData = {
            user_id: user.user_id,
            email: user.email,
            balance: parseFloat(res.rows[0].balance)
        };
        return data;
    } catch (err) {
        console.error("Error fetching user data from DB: ", err);
        throw err;
    }
}