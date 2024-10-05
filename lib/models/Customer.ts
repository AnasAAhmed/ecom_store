import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true , index: true},
  name: { type: String },
  email: { type: String, index: true },
  orders: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
  },
  wishlist: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;