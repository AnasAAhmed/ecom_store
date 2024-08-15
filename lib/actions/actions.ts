import { revalidatePath } from "next/cache"
import Collection from "../models/Collection"
import Order from "../models/Order"
import Product from "../models/Product"
import { connectToDB } from "../mongoDB"
import User from "../models/User"



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

export async function getSearchProducts(query: string, page: number) {
  const limit = 6;

  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    });
    if (!totalProducts) {
      return JSON.parse(JSON.stringify({
        totalProducts
      }))
    }
    const totalPages = Math.ceil(totalProducts / limit);

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .select('-reviews -description -variants')
      .skip(skip)
      .limit(limit);

    return JSON.parse(JSON.stringify({
      products: searchedProducts,
      totalPages,
      totalProducts,
    }));
  } catch (err) {
    console.error('[search_GET]', err);
    throw new Error('Internal Server Error 500');
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

export async function getWishList(userId: string) {
  try {
    await connectToDB();

    // Fetch the user with populated wishlist
    const wishlist = await User.findOne({ clerkId: userId }) // Replace with the actual user ID or handle authentication
      .populate({
        path: "wishlist",
        model: Product,
      })
      .select("wishlist");
    return JSON.parse(JSON.stringify(wishlist));
  } catch (error) {
    const typeError = error as Error;
    console.log('somathing wrong' + typeError.message);
    throw new Error('somathing wrong' + typeError.message);
  }
}

export async function getOrders(customerId: string, page: number) {
  try {
    await connectToDB();
    const limit = 6
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments({ customerClerkId: customerId });
    if (!totalOrders) {
      return JSON.parse(JSON.stringify({
        totalOrders
      }))
    }
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find({
      customerClerkId: customerId,
    }).populate({ path: "products.product", model: Product }).sort({ createdAt: 'desc' }).limit(limit).skip(skip);

    return JSON.parse(JSON.stringify({
      orders,
      totalPages,
      totalOrders
    }))

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

