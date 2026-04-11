'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
            <form
                className="bg-white border border-gray-200 rounded-xl shadow-xl p-8 flex flex-col gap-5 w-80"
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log(username, password);
                    router.push("/trade");
                }}
            >
                <h1 className="text-2xl font-bold text-center mb-2">Log In</h1>

                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 mt-2 transition-colors"
                >
                    Log In
                </button>
            </form>
        </div>
    )
}