'use client'

import { useState } from 'react';



import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter()

    
    async function handleSubmit (e: React.SyntheticEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
            router.push('/trade');
        } else {
            const data = await res.json();
            alert(data.error || 'Signup failed');
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
            <form
                className="bg-white border border-gray-200 rounded-xl shadow-xl p-8 flex flex-col gap-5 w-80"
                onSubmit={handleSubmit}
            >
                <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a strong password"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <small className="form-hint text-gray-500">
                        At least 8 characters
                    </small>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 mt-2 transition-colors"
                >
                    Sign Up
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log In</Link>
            </p>
        </div>
    )
}