'use client'


import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter()
    return (

        <form onSubmit={(e) => {
            e.preventDefault();
            console.log(username, password)
            router.push("/")
        }

        }>
            <label htmlFor="username">Username: </label><br />
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}></input><br />

            <label htmlFor="password">Password: </label><br />
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br />
            <button type="submit">Log In</button>
        </form>

    )
}