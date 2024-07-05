'use client'
import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { useRegion } from '@/lib/hooks/useCart'
import { ChevronDown } from 'lucide-react'

const Region = ({ isHome = true }: { isHome?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { country, currency, setCountry, setCurrency } = useRegion();

    const onClose = () => setIsOpen(false)
    useEffect(() => {
        if (isHome) {
            if (!currency) {
                setTimeout(() => {
                    setIsOpen(true)
                }, 10000)
            }
        }
    }, [])

    const handleCountryChange = (e: any) => {
        setCountry(e.target.value);
    };

    const handleCurrencyChange = (e: any) => {
        setCurrency(e.target.value);
    };

    return (
        <div>
            {!isHome &&
                <button
                className="flex items-center border rounded-lg px-2 py-1 hover:bg-black hover:text-white max-md:hidden"
                onClick={() => setIsOpen(true)}>
                    {currency.toUpperCase()||'USD'}
                    <ChevronDown size={'1.2rem'}/>
                </button>
            }
            <Modal onClose={onClose} isOpen={isOpen} overLay={true}>
                <div className="h-56 w-56 flex flex-col justify-center items-center space-y-4 bg-white p-4 rounded shadow-md">

                    <select
                        name="currency"
                        value={currency}
                        onChange={handleCurrencyChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="usd">$ USD</option>
                        <option value="pkr">Rs PKR</option>
                    </select>
                    <select
                        name="country"
                        value={country}
                        onChange={handleCountryChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Country</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Other">Other</option>
                    </select>
                    <button className="p-2 border border-gray-300 rounded text-2xl" onClick={onClose}>
                        Confirm
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default Region
