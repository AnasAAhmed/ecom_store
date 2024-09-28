import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return new NextResponse("Product Id required", { status: 400 });
    }

    const productIndex = user.wishlist.indexOf(productId);

    let isLiked;
    if (productIndex !== -1) {
      // Dislike
      user.wishlist.splice(productIndex, 1);
      isLiked = false;
    } else {
      // Like
      user.wishlist.push(productId);
      isLiked = true;
    }

    await user.save();
    
    return NextResponse.json({ user, isLiked }, { status: 200 });
  } catch (err) {
    console.log("[wishlist_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
