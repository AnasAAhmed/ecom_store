import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { v4 as uuidv4 } from 'uuid';
import { reduceStock } from "@/lib/actions/actions";


export async function OPTIONS(data: any,) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": `${process.env.ECOM_STORE_URL}`,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json(data, { headers: corsHeaders });
}
export async function POST(req: NextRequest) {
  const idempotencyKey = uuidv4();
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "PK"],
      },
      shipping_options: [
        { shipping_rate: "shr_1PBurSBxsJkAdKVPHis4y2cO" },
        { shipping_rate: "shr_1PBuy1BxsJkAdKVPWZgtJcuW" },
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: cartItem.item.title,
            images: [cartItem.item.media[0]],
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      success_url: `${process.env.ECOM_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOM_STORE_URL}/cart`,
    },{
      idempotencyKey
    });
    try {
      await reduceStock(cartItems);
    } catch (reduceStockError) {
      console.error("Error during stock reduction:", reduceStockError);
      return new NextResponse("Failed to reduce stock", { status: 500 });
    }
    return OPTIONS(session); 
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
