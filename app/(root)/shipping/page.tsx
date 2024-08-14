'use client';

import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from '@clerk/nextjs';
import useCart, { useRegion } from '@/lib/hooks/useCart';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const shippingSchema = z.object({
    street: z.string().min(15),
    city: z.string().min(4),
    state: z.string().min(5),
    postalCode: z.string().min(5, "Postal Code is required and must be at least 4 digits"),
    phone: z.string().min(11, "Phone must be at least 11 digits"),
    country: z.string().min(8, "Country is required"),
    shippingRate: z.string().min(22, "Please Select at least 1 of them")
});

const Shipping = () => {
    const { user } = useUser();
    const cart = useCart();
    const { currency, exchangeRate } = useRegion();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [shippingRateNumber, setShippingRateNumber] = useState<number>(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(shippingSchema),
    });
    const total = cart.cartItems.reduce(
        (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0
    );

    const totalshippingRate = total + shippingRateNumber;
    const totalAmount = (totalshippingRate * exchangeRate).toFixed();

    // const convertToPKR = (amount: number) => {
    //     return (amount * exchangeRate);
    // };

    const customerInfo = {
        clerkId: user?.id,
        email: user?.emailAddresses[0].emailAddress,
        name: user?.fullName,
    };

    const submitHandler = async (data: any) => {
        const { street, city, state, postalCode, phone, country, shippingRate } = data;

        const shippingAddress = { street, city, state, postalCode, phone, country };

        if (!user) return toast.error("Not Enough Details");
        if (!cart.cartItems.length) return toast.error("Your Cart is Empty");
        if (currency !== "PKR") return toast.error("Please select PKR Currency");

        setIsProcessing(true);

        const orderData = {
            shippingAddress,
            products: cart.cartItems.map(item => ({
                product: item.item._id,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                variantId: item.variantId,
            })),
            totalAmount,
            shippingRate: `${shippingRate} (${(shippingRateNumber*exchangeRate).toFixed()})`,
            exchangeRate,
            currency: currency || 'usd',
            customerClerkId: user.id,
            customerEmail: user.emailAddresses[0].emailAddress,
            status: "COD & Processing",
        };
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderData, customerInfo }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                toast.error(errorResponse.message || 'Failed to place order');
            } else {
                cart.clearCart();
                toast.success('Order Placed Successfully');
                router.push('/orders');
            }
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                toast.error(err.message || 'An error occurred while processing your order');
            } else {
                toast.error('An error occurred while processing your order');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart.cartItems.length || !user) return;

    return (
        <div className="px-8 py-8 sm:px-24">
            <Link href='/cart' className="back-btn"><ArrowLeftIcon /></Link>
            <form onSubmit={handleSubmit(submitHandler)}>
                <h1 className="text-2xl font-semibold mb-8 text-center">Shipping Address</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div>
                        <input
                            {...register('street')}
                            placeholder="Address"
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        />
                        {errors.street && <span className="text-red-1 ml-3">{(errors.street.message as string)}</span>}
                    </div>
                    <div>
                        <input
                            {...register('city')}
                            placeholder="City"
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        />
                        {errors.city && <span className="text-red-1 ml-3">{(errors.city.message as string)}</span>}
                    </div>
                    <div>
                        <input
                            {...register('state')}
                            placeholder="State"
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        />
                        {errors.state && <span className="text-red-1 ml-3">{(errors.state.message as string)}</span>}
                    </div>
                    <div>
                        <select
                            {...register('country')}
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        >
                            <option value="pakistan">Pakistan</option>
                        </select>
                        {errors.country && <span className="text-red-1 ml-3">{(errors.country.message as string)}</span>}
                    </div>
                    <div>
                        <input
                            {...register('postalCode')}
                            type="number"
                            placeholder="Postal Code"
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        />
                        {errors.postalCode && <span className="text-red-1 ml-3">{(errors.postalCode.message as string)}</span>}
                    </div>
                    <div>
                        <input
                            {...register('phone')}
                            type="number"
                            placeholder="Phone"
                            min={11}
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        />
                        {errors.phone && <span className="text-red-1 ml-3">{(errors.phone.message as string)}</span>}
                    </div>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                    <div className="relative flex border rounded-lg px-3 hover:bg-gray-300 border-gray-300 items-center gap-2">
                        <input
                            {...register('shippingRate')}
                            type="radio"
                            id="fast-delivery"
                            value="Fast delivery 3-5 Days COD"
                            onChange={() => setShippingRateNumber(4)}
                        />
                        <label htmlFor="fast-delivery" className="cursor-pointer flex items-center gap-2 rounded-lg py-3 px-4 w-full ">
                            Fast delivery 2-5 Days (Cash On Delivery) ({currency} {4 * exchangeRate})
                        </label>
                    </div>
                    <div className="relative flex border rounded-lg px-3 hover:bg-gray-300 border-gray-300 items-center gap-2">
                        <input
                            {...register('shippingRate')}
                            type="radio"
                            id="standard-delivery"
                            value="Standard delivery 5-8 Days COD"
                            onChange={() => setShippingRateNumber(1)}
                        />
                        <label htmlFor="standard-delivery" className="cursor-pointer flex items-center gap-2 rounded-lg py-3 px-4 w-full ">
                            Standard delivery 3-8 Days (Cash On Delivery) ({currency} {1 * exchangeRate})
                        </label>
                    </div>
                    {errors.shippingRate && <span className="ml-3 text-red-1">{(errors.shippingRate.message as string)}</span>}
                </div>

                <h1 className="text-2xl font-semibold mb-4 text-center">Summary</h1>

                <div className="border p-4 rounded-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4">Order Details:</h2>
                    <ul className="mb-4">
                        {cart.cartItems.map((item, index) => (
                            <li key={index} className="flex border-b pb-2 flex-wrap sm:justify-between gap-4 items-center mb-2">
                                <span><img src={item.item.media[0]} alt="product" className="h-14 w-14 sm:h-24 sm:w-24" />
                                </span>
                                <span>{item.item.title}</span>
                                <span> (x{item.quantity})</span>
                                <span>= {currency + ' ' + (item.item.price * item.quantity * exchangeRate)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center mb-2">
                        <span>Shipping Rate (C.O.D):</span>
                        <span>{currency + ' ' + (shippingRateNumber * exchangeRate).toFixed()}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                        <span>Total Amount:</span>
                        <span>{currency + ' ' + totalAmount}</span>
                    </div>
                </div>
                <button type="submit" className="flex items-center justify-center rounded-lg transition-all duration-200 text-lg mt-8 text-white bg-black py-3 w-full hover:bg-gray-200 hover:text-black">
                    {isProcessing ? <LoaderIcon className="animate-spin" /> : `Place Order For ${currency + ' ' + totalAmount}`}
                </button>
            </form>
        </div>
    );
};
export default Shipping;
