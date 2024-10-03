import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, index: true },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const WishList = mongoose.models.WishList || mongoose.model("WishList", wishListSchema);

export default WishList;