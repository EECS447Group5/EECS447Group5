
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool ({ connectionString: process.env.DB_URL});



export async function POST(request: Request) {
    //parse JSON
    const body = await request.json();
    const { email, password } = body;

    //Validation
    if (typeof email !== 'string' || typeof password !== 'string') {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const result = await pool.query(
        `SELECT user_id, email, password_hash FROM users WHERE email = $1`, [email]

    );

    if (result.rows.length === 0) {
        return NextResponse.json({error: 'Invalid email or password'}, { status: 401 });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {

        const sessionToken = crypto.randomBytes(32).toString('base64url');

        await pool.query(
            `INSERT INTO sessions (id, user_id, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
            [sessionToken, user.user_id]
        )
        

        const response = NextResponse.json({ user: { user_id: user.user_id, email: user.email} });

        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });
            return response;
    }

    else {
        return NextResponse.json({error: 'Invalid email or password'}, { status: 401});
    }
       
}