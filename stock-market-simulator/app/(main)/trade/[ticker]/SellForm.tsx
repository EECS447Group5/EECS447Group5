'use client'
import { useState } from 'react'

export default function SellForm({ ticker }: { ticker: string }) {
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");

    return (
        <div className="border-t border-gray-200 pt-6">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setMessage(`Sold ${quantity} share(s) of ${ticker}`);
                }}
                className="flex flex-col gap-4"
            >
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity
                </label>
                <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-32"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 transition-colors self-start"
                >
                    Sell
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