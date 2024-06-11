import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { orderId: String } }) => {
    try {
        await connectToDB();

        const order = await Order.findById(params.orderId);

        if (!order) {
            return new NextResponse("Order not found", {
                status: 404,
            });
        }

        const { status } = await req.json();

        if (!status) {
            return new NextResponse("Status is required", {
                status: 400,
            });
        }

        order.status = status;
        await order.save();

        return NextResponse.json({ message: "Order Status Updated Successfully" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
        } else {
            return new NextResponse('An unknown error occurred', { status: 500 });
        }
    }
};
