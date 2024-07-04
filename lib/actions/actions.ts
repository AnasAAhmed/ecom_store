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
      .select("-reviews -category -description")
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
      .select("-reviews -category -description")
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

// export async function getSearchedProducts(query: string,num?:number) {
//   try {
//     await connectToDB()

//     const searchedProducts = await Product.find({
//       $or: [
//         { title: { $regex: query, $options: "i" } },
//         { category: { $regex: query, $options: "i" } },
//         { tags: { $in: [new RegExp(query, "i")] } } // $in is used to match an array of values
//       ]

//     }).select("-reviews -description").limit(num!);
//     // select only the required fields

//     return JSON.parse(JSON.stringify(searchedProducts))
//   } catch (err) {
//     console.log("[search_GET]", err)
//     throw new Error('Internal Server Error')
//   }
// }
export async function getSearchedProducts(query: string, page: number = 1, limit: number = 10) {
  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .select('-reviews -description')
      .skip(skip)
      .limit(limit);

    return JSON.parse(JSON.stringify(searchedProducts));
  } catch (err) {
    console.log('[search_GET]', err);
    throw new Error('Internal Server Error');
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
    }).select("-reviews");

    if (!relatedProducts) {
      throw new Error('No related products found')
    }
    return JSON.parse(JSON.stringify(relatedProducts))
  } catch (err) {
    console.log("[related_GET", err)
    throw new Error('Internal Server Error')
  }
}


// export const reduceStock = async () => {
type OrderProducts = {
  // product: string,//it is productId
  item: { _id: string; },//it is productId
  color: string,
  size: string,
  variantId?: string,
  quantity: number

}

//for webhook strip checkout form
export const reduceStock = async (cartItems: OrderProducts[]) => {
  await connectToDB();
  for (const order of cartItems) {
    //  const order = cartItems;
    const product: ProductType | null = await Product.findById(order.item._id);
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
    if (order.size || order.color||order.variantId) {
      const variant = product.vatiants.find(v => v._id!.toString() === order.variantId);
      if (!variant) throw new Error(`Variant not ${order.variantId} found for product: ${order.item._id}, size: ${order.size}, color: ${order.color}`);

      // Reduce the variant stock
      if (variant.quantity! >= order.quantity) {
        variant.quantity! -= order.quantity;
      } else {
        console.error(`Not enough stock for variant: ${order.item._id}, size: ${order.size}, color: ${order.color}`);
        throw new Error("Not enough stock for this variant");
      }
    }
  };
}
type OrderProductCOD = {

  product: string,//it is product._id
  color: string,
  size: string,
  variantId?: string,
  quantity: number

}
//for COD form
export const stockReduce = async (products: OrderProductCOD[]) => {
  for (let i = 0; i < products.length; i++) {
     const order = products[i];
    const product: ProductType | null = await Product.findById(order.product);
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
    if (order.size || order.color||order.variantId) {
      const variant = product.vatiants.find(v => v._id!.toString() === order.variantId);
      if (!variant) throw new Error(`Variant not ${order.variantId} found for product: ${order.product}, size: ${order.size}, color: ${order.color}`);

      // Reduce the variant stock
      if (variant.quantity! >= order.quantity) {
        variant.quantity! -= order.quantity;
      } else {
        console.error(`Not enough stock for variant: ${order.product}, size: ${order.size}, color: ${order.color}`);
        throw new Error("Not enough stock for this variant");
      }
    }
};}

