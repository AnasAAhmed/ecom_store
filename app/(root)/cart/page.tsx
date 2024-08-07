"use client";

import React, { FormEvent, useState } from 'react';
import useCart, { useRegion } from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { LoaderIcon, MinusCircle, PlusCircle, Trash, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

const Cart = () => {
  const router = useRouter();
  const { user } = useUser();
  const { currency } = useRegion();
  const [loading, setLoading] = useState(false);
  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState(false);
  const [isCOD, setIsCOD] = useState<string>("NULL");

  const cart = useCart();
  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );

  const totalAfterTax = parseFloat((total).toFixed(2));
  const totalRounded = currency === 'pkr' ? totalAfterTax * 250 : totalAfterTax;
  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };
  const handleCheckout = async () => {
    if (isCOD === "NULL") return (setMessage(true), setTimeout(() => { setMessage(false) }, 2000));
    ;
    if (isCOD === "COD") {
      if (!user) {
        return toast((t) => (
          <span>
            Please Sign-in first <b> it will help us to track your orders </b>
            <button className='bg-black text-white hover:opacity-45 py-1 px-2 mx-3 rounded-md' onClick={() => toast.dismiss(t.id)}>
              Dismiss
            </button>
            <button className='border-black hover:opacity-45 border py-1 px-2 rounded-md' onClick={() => router.push("/sign-in")}>
              Sign-in
            </button>
          </span>
        ));
      } else {
        setLoading(true)
        router.push(`/shipping`);
      }
    } else {
      try {
        if (!user) {
          return toast((t) => (
            <span>
              Please Sign-in first <b> it will help us to track your orders </b>
              <button className='bg-black text-white hover:opacity-75 py-1 px-2 mx-3 rounded-md' onClick={() => toast.dismiss(t.id)}>
                Dismiss
              </button>
              <button className='border-black hover:opacity-75 border py-1 px-2 rounded-md' onClick={() => router.push("/sign-in")}>
                Sign-in
              </button>
            </span>
          ));
        }
        else {
          setLoading(true)
          const res = await fetch(`/api/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ cartItems: cart.cartItems, customer,currency}),
          });

          if (res.ok) {
            const data = await res.json();
            window.location.href = data.url;
            console.log(data);
          } else {
            toast.error(`HTTP error! Status: ${res.statusText}`)
            console.error(`HTTP error! Status: ${res.status}`);
          }
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
        toast.error(`[checkout_POST] ${err}`)
        console.error("[checkout_POST]", err);
      }
    }
  };

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />
        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem, i) => (
              <div key={i} className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between">
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0]}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt="product"
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}
                    <p className="text-small-medium">{currency.toUpperCase()} {currency==='pkr'?cartItem.item.price*250:cartItem.item.price}</p>
                    <p className="text-small-medium">{cartItem.item.stock < 5 ? `only ${cartItem.item.stock} left` : cartItem.item.stock}</p>
                  </div>
                </div>

                {cartItem.item.stock > 0 ? (
                  <div className="flex gap-4 items-center">
                    <MinusCircle
                      className="hover:text-red-1 cursor-pointer"
                      onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                    />
                    <p className="text-body-bold">{cartItem.quantity}</p>
                    <PlusCircle
                      className="hover:text-red-1 cursor-pointer"
                      onClick={() => cart.increaseQuantity(cartItem.item._id)}
                    />
                  </div>
                ) : (
                  <p className='text-red-1 font-semibold'>Not Available</p>
                )}

                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='w-1/3 max-lg:w-full  flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-3' style={{ height: `${expand ? "26" : "12"}rem` }}>
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${cart.cartItems.length > 1 ? "items" : "item"})`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>{currency.toUpperCase()||'$'} {totalRounded}</span>
        </div>
        {expand &&
          <div className="flex flex-col gap-4 ">
            <div className='flex flex-row justify-between items-center'>
              <p className="text-body-bold">Select Payment Method</p>
              <button onClick={() => setExpand(false)}><XCircleIcon /></button>
            </div>
            <div className="flex border rounded-lg px-3 hover:bg-gray-300 border-gray-300 items-center gap-2">
              <input
                required
                type="radio"
                name="shippingRate"
                id="COD"
                disabled={loading}
                onChange={(e) => { setIsCOD("COD"); setMessage(false) }}
              />
              <label htmlFor="COD" className="cursor-pointer flex items-center gap-2 rounded-lg py-3 px-4 w-full ">
                C.O.D (Pakistan Only) (free)
              </label>
            </div>
            <div className="flex border rounded-lg px-3  hover:bg-gray-300 border-gray-300 items-center gap-2">
              <input
                required
                type="radio"
                name="shippingRate"
                id="ONLINE-PAYMENT"
                disabled={loading}
                onChange={(e) => { setIsCOD("ONLINE"); setMessage(false) }}
              />
              <label htmlFor="ONLINE-PAYMENT" className="cursor-pointer flex items-center gap-2  rounded-lg py-3 px-4 w-full ">

                Online Payment
              </label>
            </div>
            {message && <p className="text-small-medium text-red-1">Please Select Payment Method</p>}
            <button
              className={`border rounded-lg flex justify-center ${cart.cartItems.length === 0 && "cursor-not-allowed"} text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white`}
              onClick={handleCheckout}
              disabled={cart.cartItems.length === 0}
            >
              {loading ? <LoaderIcon className='animate-spin h-[17px]' /> : "Checkout"}
            </button>
          </div>
        }
        {!expand && <button
          className={`border rounded-lg flex justify-center ${cart.cartItems.length === 0 && "cursor-not-allowed"} text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white`}
          onClick={() => setExpand(true)}
          disabled={cart.cartItems.length === 0||totalRounded <1}
        >
          Proceed
        </button>}
      </div>
    </div>
  );
};

export default Cart;

