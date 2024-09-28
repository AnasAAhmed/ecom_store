import { revalidatePath } from "next/cache"
import Collection from "../models/Collection"
import Order from "../models/Order"
import Product from "../models/Product"
import { connectToDB } from "../mongoDB"
import User from "../models/User"
import Review from "../models/Review"



export async function getCollections() {
  try {

    const collections = await Collection.find().sort({ createdAt: "desc" }).select("image title").limit(6);

    return JSON.parse(JSON.stringify(collections))

  } catch (err) {
    console.log("[collections_GET]", err)
    throw new Error('Internal Server Error')
  }
}


export async function getCollectionDetails(title: string) {
  try {
    await connectToDB();

    const collection = await Collection.findOne({ title }).populate({ path: "products", model: Product });

    if (!collection) {
      return null
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
      .select('-category -description -variants -timestamps')
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
      .select("-category -description -variants -timestamps")
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
      .select("-category -description -variants -timestamps")
      .limit(4);

    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error('Internal Server Error');
  }
}
export async function getProductDetails(slug: string) {
  try {
    await connectToDB();
    const product = await Product.findOne({ slug });
    if (!product) {
      return null;
    };

    return JSON.parse(JSON.stringify(product))
  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error')

  }
}
export async function getProductDetailsForSeo(slug: string) {
  try {
    await connectToDB();
    const regexPattern = slug.replace(/-/g, " ") ; 
    const product = await Product.findOne({ 
      $or: [
        { title: { $regex: regexPattern, $options: 'i' } },  // Search by title with spaces
        { slug: { $regex: slug, $options: 'i' } }            // Search by exact or similar slug
      ]
    });
    if (!product) {
      return null;
    };

    return JSON.parse(JSON.stringify(product))
  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error')

  }
}

export async function getProductReviews(productId: string, page: number) {
  try {
    const skip = (page - 1) * 4;
    await connectToDB();
    const totalReviews = await Review.countDocuments({ productId });
    const reviews = await Review.find({ productId }).limit(4).skip(skip);


    return JSON.parse(JSON.stringify({ reviews, totalReviews }))
  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error')

  }
};

export async function getWishList(userId: string) {
  try {
    await connectToDB();

    const wishlist = await User.findOne({ clerkId: userId })
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

export async function getRelatedProducts(_id: string, category: string, collections: string[]) {
  try {
    await connectToDB()

    const relatedProducts = await Product.find({
      $or: [
        { category: category },
        { collections: { $in: collections } }
      ],
      _id: { $ne: _id }
    }).select("-description -variants -category -timestamps");

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

