import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest,{ params }: { params: { productId: String } }) => {
    try {
        await connectToDB();
        const product = await Product.findById(params.productId).populate({
            path: "collections",
            model: Collection,
        });

        if (!product) {
            return new NextResponse('Product not found')
        }
        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.log("[productId_GET]", err);
        return new NextResponse('Internal Server Error')

    }
};
