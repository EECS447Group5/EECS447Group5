'use client'
import { useState } from 'react'
import { UserData } from '@/lib/users';
import { buyStock } from '@/lib/buy';

export default function BuyForm({ ticker, user, price }: { ticker: string; user: UserData; price: number }) {
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    
    const max = Math.floor(user.balance / price);
    const min = max < 1 ? 0 : 1;
    if (quantity > max) {
        setQuantity(max);
    }

    return (
        <div className="border-t border-gray-200 pt-6">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (quantity < 1) {
                        setMessage("Quantity must be at least 1");
                        return;
                    }
                    else if (quantity * price > user.balance) {
                        setMessage("Insufficient balance");
                        return;
                    };
                    try {
                        buyStock(user.user_id, ticker, quantity, price);
                        setMessage(`Bought ${quantity} share(s) of ${ticker}`);
                    } catch (error) {
                        setMessage(`Error occurred while attempting to buy ${quantity} share(s) of ${ticker}`);
                    }
                }}
                className="flex flex-col gap-4"
            >
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity
                </label>
                <input
                    id="quantity"
                    type="number"
                    max={max}
                    min={min}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-32"
                />
                <p className="text-sm text-gray-500">
                    Available Balance: ${user.balance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                    Cost: ${(quantity * price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                    Remaining Balance: ${(user.balance - quantity * price).toFixed(2)}
                </p>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 transition-colors self-start"
                >
                    Buy
                </button>
            </form>

            {message && (
                <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                    {message}
                </p>
            )}
        </div>
    );
}