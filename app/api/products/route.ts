import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
) => {
  try {
    await connectToDB();

    const { productIds } = await req.json(); // Get productIds from the request body

    if (!productIds || productIds.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No product IDs provided" }),
        { status: 400 }
      );
    }

    const products = await Product.find({
      _id: { $in: productIds },
    })
      .populate({
        path: "collections",
        model: Collection,
      })
      .select("-reviews -variants");

    if (!products || products.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Products not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (err) {
    console.log("[productIds_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};
