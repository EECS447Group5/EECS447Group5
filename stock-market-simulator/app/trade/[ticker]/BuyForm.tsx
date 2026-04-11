'use client'
import { useState } from 'react'



export default function BuyForm ({ ticker }: { ticker: string }) {
    const [quantity, setQuantity] = useState(0);
    const [message, setMessage] = useState("");

    return (
        <div>
        <form onSubmit = {(e) => { 
            e.preventDefault();
            const newMessage = `Bought ${quantity} shares of ${ticker}`;
            setMessage(newMessage);
            console.log(newMessage);
            
        }}>
        <label htmlFor="buy" >Enter numerical quantity you want to buy </label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <button type="submit"> Buy </button>
        </form>
        {message && <p> {message} </p>}
        </div>
    )
}