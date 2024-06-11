import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest,{ params }: { params: { id: String } }) => {
  try {
    await connectToDB();

    const stock = await Product.findById(params.id).select('stock');
    if (!stock) {
      return new NextResponse('Product not found', { status: 404 });
    }

    return NextResponse.json(stock, { status: 200 });
  } catch (err) {
    console.log("[users_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
