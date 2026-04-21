
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool ({ connectionString: process.env.DB_URL});



export async function POST(request: Request) {
    //parse JSON
    const body = await request.json();
    const { email, password } = body;

    // Validate
    if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }
    if (email.length > 255) {
    return NextResponse.json({ error: 'Email too long' }, { status: 400 });
    }
    if (typeof password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }
    if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (password.length > 128) {
    return NextResponse.json({ error: 'Password too long' }, { status: 400 });
    }
    
    //Hash the password

    const passwordHash = await bcrypt.hash(password, 10);

    // Return the response
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING user_id, email`,
            [email, passwordHash]

        );
        const newUser = result.rows[0];


        const sessionToken = crypto.randomBytes(32).toString('base64url');

        await client.query(
            `INSERT INTO sessions (id, user_id, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
            [sessionToken, newUser.user_id]
        )
        
        await client.query('COMMIT');

        const response = NextResponse.json({ user: newUser }, {status: 201});

        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        return response;



    } catch (err: any) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409});
        }
           
        throw err;
    } finally {
        client.release();

    }
}