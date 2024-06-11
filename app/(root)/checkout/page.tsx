// 'use client';

// import {
//     Elements,
//     PaymentElement,
//     useElements,
//     useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { ArrowLeft, LoaderIcon } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { FormEvent, useState } from "react";
// import toast from "react-hot-toast";
// import { useUser } from '@clerk/nextjs';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// const CheckOutForm = () => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const { user } = useUser();
//     const router = useRouter();
//     const [isProcessing, setIsProcessing] = useState<boolean>(false);
//     ;

//     const searchParams = useSearchParams();
//     const orderId = searchParams.get('orderId');


//     const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!stripe || !elements || !user) return;

//         setIsProcessing(true);

//         const { paymentIntent, error } = await stripe.confirmPayment({
//             elements,
//             confirmParams: { return_url: window.location.origin },
//             redirect: "if_required",
//         });

//         if (paymentIntent?.status === "succeeded") {
//             // Clear the cart and update the order status to 'Paid'
//             await fetch(`/api/order/${orderId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ status: "Online-Paid & Processing-Order" }),
//             });

//             toast.success("Payment Successful");
//             toast.success("Order Placed Successfully");
//             router.push("/orders");
//         }
//         if (error) {
//             // Update order status to 'Not Paid' in case of payment failure
//             await fetch(`/api/order/${orderId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ status: "Online-Payment-Failed" }),
//             });
//             setIsProcessing(false);
//             toast.error(`Payment was not successful ${error}`);
//         }

//     };


//     return (
//         <form onSubmit={submitHandler} className="px-8 py-8 sm:px-24">
//             <PaymentElement />
//             <button type="submit" className="flex items-center justify-center rounded-lg transition-all duration-200 text-lg mt-8 text-white bg-black py-3 w-full hover:bg-gray-200 hover:text-black" disabled={isProcessing}>
//                 {isProcessing ? <LoaderIcon className="animate-spin" /> : 'Pay'}
//             </button>
//         </form>
//     );
// };

// const Checkout = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const clientSecret = searchParams.get('clientSecret');
//     const { user } = useUser();

//     if (!clientSecret||!user) return router.push('/shipping');

//     return (
//         <Elements
//             options={{ clientSecret }}
//             stripe={stripePromise}
//         >
//             <Link className="back-btn" href={"/cart"}>
//                 <ArrowLeft />
//             </Link>
//             <CheckOutForm />
//         </Elements>
//     );
// };

// export default Checkout;
