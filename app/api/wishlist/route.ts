import WishList from "@/lib/models/WishList";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    await connectToDB()

    let wishList = await WishList.findOne({ clerkId: userId })

    // When the user sign-up for the 1st time, immediately we will create a new user for them
    if (!wishList) {
      wishList = await WishList.create({ clerkId: userId })
      await wishList.save()
    }

    return NextResponse.json(wishList, { status: 200 })
  } catch (err) {
    console.log("[users_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}