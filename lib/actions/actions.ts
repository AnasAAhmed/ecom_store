import { revalidatePath } from "next/cache"
import Collection from "../models/Collection"
import Order from "../models/Order"
import Product from "../models/Product"
import { connectToDB } from "../mongoDB"



export async function getCollections() {
  try {
    await connectToDB()

    const collections = await Collection.find().sort({ createdAt: "desc" }).select("image title")

    return JSON.parse(JSON.stringify(collections))

  } catch (err) {
    console.log("[collections_GET]", err)
    throw new Error('Internal Server Error')
  }
}


export async function getCollectionDetails(collectionId: string) {
  try {
    await connectToDB();

    const collection = await Collection.findById(collectionId).populate({ path: "products", model: Product });

    if (!collection) {
      throw new Error('Collection not found')

    }
    return JSON.parse(JSON.stringify(collection))
  } catch (err) {
    console.log("[collectionId_GET]", err);
    throw new Error('Internal Server Error')

  }
}


export async function getProducts() {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection })
      .select("-reviews -category -description -variants")
      .limit(8);

    return JSON.parse(JSON.stringify(products))
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error('Internal Server Error')

  }
}
export async function getBestSellingProducts() {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ sold: -1, ratings: -1, createdAt: "desc" })
      .populate({ path: "collections", model: Collection })
      .select("-reviews -category -description -variants")
      .limit(4);

    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error('Internal Server Error');
  }
}
export async function getProductDetails(productId: string) {
  try {
    await connectToDB();

    const product = await Product.findById(productId).populate({
      path: "collections",
      model: Collection,
    });

    if (!product) {
      throw new Error('Product not found')
    }
    return JSON.parse(JSON.stringify(product))
  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error')

  }
}

export async function getOrders(customerId: string) {
  try {
    await connectToDB();

    const orders = await Order.find({
      customerClerkId: customerId,
    }).populate({ path: "products.product", model: Product }).sort({ createdAt: 'desc' });

    return JSON.parse(JSON.stringify(orders))

  } catch (err) {
    console.log("[customerId_GET", err);
    throw new Error('Internal Server Error')

  }
}

export async function getRelatedProducts(productId: string) {
  try {
    await connectToDB()

    const product = await Product.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { collections: { $in: product.collections } }
      ],
      _id: { $ne: product._id } // Exclude the current product
    }).select("-reviews -description -variants");

    if (!relatedProducts) {
      throw new Error('No related products found')
    }
    return JSON.parse(JSON.stringify(relatedProducts))
  } catch (err) {
    console.log("[related_GET", err)
    throw new Error('Internal Server Error')
  }
}


//for webhook strip checkout form
export const reduceStock = async (cartItems: OrderProducts[]) => {
  await connectToDB();
  for (const order of cartItems) {
    //  const order = cartItems;
    const product = await Product.findById(order.item._id);
    if (!product) throw new Error("Product Not Found");

    // Reduce the general product stock
    if (product.stock >= order.quantity) {
      product.stock -= order.quantity;
      product.sold += order.quantity;
    } else {
      console.error(`Not enough stock for product: ${order.item._id}`);
      throw new Error("Not enough stock for this Product");
    }

    // Find the matching variant
    if (order.size || order.color || order.variantId) {
      const variant = product.variants.find((v: Variant) => v._id!.toString() === order.variantId);
      if (!variant) throw new Error(`Variant not ${order.variantId} found for product: ${order.item._id}, size: ${order.size}, color: ${order.color}`);

      // Reduce the variant stock
      if (variant.quantity! >= order.quantity) {
        variant.quantity! -= order.quantity;
      } else {
        console.error(`Not enough stock for variant: ${order.item._id}, size: ${order.size}, color: ${order.color}`);
        throw new Error("Not enough stock for this variant");
      }
    }
    await product.save();

    revalidatePath(`/products/${order.item._id}`);
  };
}

//for COD form
export const stockReduce = async (products: OrderProductCOD[]) => {
  for (let i = 0; i < products.length; i++) {
    const order = products[i];
    const product = await Product.findById(order.product);
    if (!product) throw new Error("Product Not Found");

    // Reduce the general product stock
    if (product.stock >= order.quantity) {
      product.stock -= order.quantity;
      product.sold += order.quantity;
    } else {
      console.error(`Not enough stock for product: ${order.product}`);
      throw new Error("Not enough stock for this Product");
    }

    // Find the matching variant
    if (order.size || order.color || order.variantId) {
      const variant = product.variants.find((v: Variant) => v._id!.toString() === order.variantId);
      if (!variant) throw new Error(`Variant not ${order.variantId} found for product: ${order.product}, size: ${order.size}, color: ${order.color}`);

      // Reduce the variant stock
      if (variant.quantity! >= order.quantity) {
        variant.quantity! -= order.quantity;
      } else {
        console.error(`Not enough stock for variant: ${order.product}, size: ${order.size}, color: ${order.color}`);
        throw new Error("Not enough stock for this variant");
      }
    }
    await product.save();
    revalidatePath(`/products/${order.product}`);
  };
}

