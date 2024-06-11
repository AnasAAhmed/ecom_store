import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        await connectToDB();
        const { rating, comment, email, name, userId, photo, } = await req.json();
        const url = new URL(req.url);
        const productId = url.searchParams.get('productId') || '';
        if (!userId || !email || !name || !comment || !rating || !productId) {
            return new NextResponse("All fields are required", { status: 400 });
        }

        const review = {
            userId,
            name,
            email,
            date: new Date(),
            rating: Number(rating),
            photo,
            comment,
        };

        const product = await Product.findById(productId);
        if (!product) return new NextResponse("Product nozzzt found", { status: 404 });

        const isReviewed = product.reviews.find((rev: any) => rev.userId.toString() === userId.toString());

        if (isReviewed) {
            for (const rev of product.reviews) {
                if (rev.userId.toString() === userId.toString()) {
                    rev.rating = rating;
                    rev.comment = comment;
                    rev.date = new Date();
                }
            }
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        product.ratings = product.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / product.reviews.length;

        await product.save({ validateBeforeSave: false });


        return NextResponse.json({ message: `Review Submited Successfully` }, { status: 200 })
    } catch (err) {
        console.log("[getProductReviews_POST]", err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, res: NextResponse) => {
    try {

        await connectToDB();
        const url = new URL(req.url);
        const productId = url.searchParams.get('productId');
        const userId = url.searchParams.get('userId');

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json("Product not found ", { status: 404 })
        }

        const reviews = product.reviews.filter((rev: any) => rev.userId.toString() !== userId!.toString());

        const avg = reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
        const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            productId,
            { reviews, ratings, numOfReviews },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        return NextResponse.json({ message: `Review Deleted` }, { status: 200 })
    } catch (err) {
        console.log("[getProductReviews_POST]", err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
