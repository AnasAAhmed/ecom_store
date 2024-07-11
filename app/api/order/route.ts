import { stockReduce } from "@/lib/actions/actions";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const body = await req.json();
    const {
      orderData, customerInfo,currency
    } = body;

    const {
      shippingAddress,
      products,
      totalAmount,
      shippingRate,
      customerClerkId,
      customerEmail,
      status,
    } = orderData;
    
    if (!shippingAddress || !products || !customerClerkId || !shippingRate || !status || !totalAmount||!currency) {
      return NextResponse.json({ message: `Please enter All Details` }, { status: 400 });
    }
    if (!customerInfo.clerkId || !customerInfo.email || !customerInfo.name) {
      return NextResponse.json({ message: 'User Details Missing/Login first' }, { status: 400 });
    }

    try {
      await stockReduce(products);
    } catch (reduceStockError) {
      if (reduceStockError instanceof Error) {
        return NextResponse.json({ message: reduceStockError.message }, { status: 400 });
      } else {
        return NextResponse.json({ message: 'An unknown error occurred during stock reduction' }, { status: 400 });
      }
    }

    const newOrder = new Order({
      shippingAddress,
      products,
      totalAmount,
      shippingRate,
      customerClerkId,
      customerEmail,
      currency,
      status,
    });
    await newOrder.save();
    // console.log(newOrder);

    let customer = await Customer.findOne({ clerkId: customerInfo.clerkId })

    if (customer) {
      customer.orders.push(newOrder._id)
    } else {
      customer = new Customer({
        ...customerInfo,
        orders: [newOrder._id],
      })
    }

    await customer.save();

    return NextResponse.json({ orderId: newOrder._id }, { status: 200 });
  } catch (error) {
    console.log("NEW_ORDER.Post", error);
    return NextResponse.json({ message: `Internal server error` }, { status: 500 });
  }
};
