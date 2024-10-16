import { stockReduce } from "@/lib/actions/actions";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const body = await req.json();
    const {
      orderData, customerInfo
    } = body;

    const {
      shippingAddress,
      products,
      totalAmount,
      exchangeRate,
      shippingRate,
      currency,
    } = orderData;

    if (!shippingAddress || !products || !shippingRate || !totalAmount || !currency) {
      return NextResponse.json({ message: `Please enter All Details` }, { status: 400 });
    }
    if (!customerInfo.clerkId || !customerInfo.email ) {
      return NextResponse.json({ message: 'User Details Missing/Login first' }, { status: 400 });
    }

    await stockReduce(products);

    const newOrder = new Order({
      shippingAddress,
      products,
      totalAmount: totalAmount / exchangeRate,
      shippingRate,
      customerEmail: customerInfo.email,
      currency,
      status:'COD & Processing',
      method: 'COD',
      exchangeRate
    });
    await newOrder.save();
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
    revalidatePath('/orders')
    return NextResponse.json({ orderId: newOrder._id }, { status: 200 });
  } catch (error) {
    console.log("NEW_ORDER.Post", error);
    return NextResponse.json({ message: `Internal server error` }, { status: 500 });
  }
};
