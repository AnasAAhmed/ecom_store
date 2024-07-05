
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { productId: String } }) => {
    try {
        await connectToDB();

        const products = await Product.findById(params.productId)
            .populate({ path: "collections", model: Collection })
            .select("-reviews -category -description -variants")

        return  NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.log("[products_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}