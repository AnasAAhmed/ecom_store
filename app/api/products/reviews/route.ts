import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId')!;
    try {
        await connectToDB();

        const body = await request.json();
        const {  rating, comment, email, name, userId, photo } = body;

        if (!productId || !userId || !email || !name || !comment || !rating) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
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
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const isReviewed = product.reviews.find(
            (rev: Review) => rev.userId.toString() === userId.toString()
        );

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

        product.ratings = product.reviews.reduce((acc: any, rev: Review) => acc + rev.rating, 0) / product.reviews.length;

        await product.save({ validateBeforeSave: false });
        revalidatePath(`/products/${productId}`)

        return NextResponse.json({ message: "Review added/updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export async function DELETE(request: NextRequest) {
    try {
      await connectToDB();
  
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId')!;
      const productId = searchParams.get('productId')!;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
  
      const reviews = product.reviews.filter(
        (rev:Review) => rev.userId.toString() !== userId.toString()
      );
  
      let avg = 0;
  
      reviews.forEach((rev:Review) => {
        avg += rev.rating;
      });
  
      let ratings = 0;
  
      if (reviews.length === 0) {
        ratings = 0;
      } else {
        ratings = avg / reviews.length;
      }
  
      const numOfReviews = reviews.length;
  
      await Product.findByIdAndUpdate(
        productId,
        {
          reviews,
          ratings,
          numOfReviews,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
  
      return NextResponse.json({
        success: true,
        message: "Review Deleted",
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
