'use client';
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from '@clerk/nextjs';
import useCart from '@/lib/hooks/useCart';
import Link from "next/link";
import { useRouter } from "next/navigation";


const Shipping = () => {
    const { user } = useUser();
    const cart = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [shippingRate, setShippingRate] = useState<string>('');
    const [shippingRateNumber, setShippingRateNumber] = useState<number>(0);
    const [shippingAddress, setShippingAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        phone: "",
        country: "",
    });

    // const codCharges = isCOD ? 5 : 0
    const total = cart.cartItems.reduce(
        (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0
    );
    const taxAmount = total * 12 / 100;
    const totalAmount = parseFloat((total + taxAmount + shippingRateNumber).toFixed(2));

    const changeHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setShippingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check for necessary details
        if (!shippingAddress || !shippingRate || !user) return toast.error("Not Enough Details");
        if (!cart.cartItems.length) return toast.error("Your Cart is Empty");

        setIsProcessing(true);

        // Create orderData
        const orderData = {
            shippingAddress,
            products: cart.cartItems.map(item => ({
                product: item.item._id,
                color: item.color,
                size: item.size,
                quantity: item.quantity
            })),
            totalAmount,
            shippingRate,
            customerClerkId: user.id,
            customerEmail: user.emailAddresses[0].emailAddress,
            status: "COD & Processing",
        };

        try {
            // Create the order
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to place order');

            } else {
                cart.clearCart();
                toast.error('An error occurred while processing your order');
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
        <div className="px-8 py-8 sm:px-24 ">
            <Link href='/cart' className="back-btn"><ArrowLeftIcon /></Link>
            <form onSubmit={submitHandler}>
                <h1 className="text-2xl font-semibold mb-8 text-center">Shipping Address</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <input
                        required
                        type="text"
                        placeholder="Address"
                        name="street"
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        value={shippingAddress.street}
                        onChange={changeHandler}
                    />
                    <input
                        required
                        type="text"
                        placeholder="City"
                        name="city"
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        value={shippingAddress.city}
                        onChange={changeHandler}
                    />
                    <input
                        required
                        type="text"
                        placeholder="State"
                        name="state"
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        value={shippingAddress.state}
                        onChange={changeHandler}
                    />
                    <select
                        name="country"
                        required
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        value={shippingAddress.country}
                        onChange={changeHandler}
                    >
                        {/* <option value="">Choose Country</option> */}
                        <option value="pakistan">Pakistan</option>
                    </select>
                    <input
                        required
                        type="number"
                        placeholder="Postal Code"
                        name="postalCode"
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        value={shippingAddress.postalCode}
                        onChange={changeHandler}
                    />
                    <input
                        required
                        type="number"
                        placeholder="Phone"
                        min={11}
                        name="phone"
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        value={shippingAddress.phone}
                        onChange={changeHandler}
                    />
                </div>

                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex border rounded-lg px-3 hover:bg-gray-300 border-gray-300 items-center gap-2">
                        <input
                            required
                            type="radio"
                            name="shippingRate"
                            id="fast-delivery"
                            className="hiddaen peer"
                            value="Fast delivery 3-5 Days"
                            onChange={(e) => { setShippingRate(e.target.value); setShippingRateNumber(20); }}
                        />
                        <label htmlFor="fast-delivery" className="cursor-pointer flex items-center gap-2 rounded-lg py-3 px-4 w-full ">
                            Fast delivery 3-5 Days (Cash On Delivery) ($20)
                        </label>
                    </div>
                    <div className="flex border rounded-lg px-3  hover:bg-gray-300 border-gray-300 items-center gap-2">
                        <input
                            required
                            type="radio"
                            name="shippingRate"
                            id="standard-delivery"
                            className=" peer"
                            value="Standard delivery 5-8 Days"
                            onChange={(e) => { setShippingRate(e.target.value); setShippingRateNumber(5); }}
                        />
                        <label htmlFor="standard-delivery" className="cursor-pointer flex items-center gap-2  rounded-lg py-3 px-4 w-full ">

                            Standard delivery 5-8 Days (Cash On Delivery) ($5)
                        </label>
                    </div>
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
                                <span>= ${(item.item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center mb-2">
                        <span>Shipping Rate (C.O.D):</span>
                        <span>${shippingRateNumber}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                        <span>Total Amount:</span>
                        <span>${totalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                        <span>Tax:</span>
                        <span>${taxAmount}</span>
                    </div>
                </div>
                <button type="submit" className="flex items-center justify-center rounded-lg transition-all duration-200 text-lg mt-8 text-white bg-black py-3 w-full hover:bg-gray-200 hover:text-black">{isProcessing ? <LoaderIcon className="animate-spin" /> : `Place Order For $${totalAmount}`}</button>
            </form>
        </div>
    );
};
export default Shipping;

