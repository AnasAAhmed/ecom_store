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
      .select("-reviews -category")
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
      .sort({ ratings: -1, sold: -1, createdAt: "desc" })
      .populate({ path: "collections", model: Collection })
      .select("-reviews -category")
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

export async function getSearchedProducts(query: string) {
  try {
    await connectToDB()

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } } // $in is used to match an array of values
      ]
    }).select("-reviews");
    // select only the required fields

    return JSON.parse(JSON.stringify(searchedProducts))
  } catch (err) {
    console.log("[search_GET]", err)
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
  quantity: number

}

//for webhook strip checkout form
export const reduceStock = async (cartItems: OrderProducts[]) => {
  await connectToDB();
  for (const order of cartItems) {
    try {
      const product = await Product.findById(order.item._id);

      if (!product) {
        console.error(`Product not found: ${order.item._id}`);
        throw new Error(`Product Not Found: ${order.item._id}`);
      }

      // Reduce the general stock
      if (product.stock >= order.quantity) {
        product.stock -= order.quantity;
        product.sold += order.quantity;
      } else {
        console.error(`Not enough stock for product: ${order.item._id}`);
        throw new Error("Not enough stock for this Product");
      }

      // Reduce the size stock if specified
      if (order.size) {
        const sizeItem = product.sizes.find((size: any) => size.size === order.size);
        if (sizeItem) {
          if (sizeItem.quantity >= order.quantity) {
            sizeItem.quantity -= order.quantity;
          } else {
            throw new Error("Not enough stock for the specified size");
          }
        } else {
          // console.error(`Size ${order.size} not found for product: ${order.item._id}`);
          throw new Error(`Size ${order.size} not found for product ${order.item._id}`);
        }
      }

      // Reduce the color stock if specified
      if (order.color) {
        const colorItem = product.colors.find((color: any) => color.color === order.color);
        if (colorItem) {
          if (colorItem.quantity >= order.quantity) {
            colorItem.quantity -= order.quantity;
          } else {
            throw new Error("Not enough stock for the specified color");
          }
        } else {
          throw new Error(`Color ${order.color} not found for product ${order.item._id}`);
        }
      }

      await product.save();
      console.log(`Stock reduced successfully for product: ${order.item._id}`);
    } catch (error) {
      console.error(`Failed to reduce stock for product: ${order.item._id}`, error);
      throw error;
    }
  }
};
type OrderProductEmbeded = {

  product: string,//it is product._id
  color: string,
  size: string,
  quantity: number

}
//for custom embede stript form
export const stockReduce = async (products: OrderProductEmbeded[]) => {
  for (let i = 0; i < products.length; i++) {
    const order = products[i];
    const product = await Product.findById(order.product);
    if (!product) throw new Error("Product Not Found");

    // Reduce the general stock

    if (product.stock > 0) {
      product.stock -= order.quantity;
      product.sold += order.quantity;
    } else {
      throw new Error("Not enough stock for the this Product");
    }

    // Reduce the size stock if specified
    if (order.size) {
      const sizeItem = product.sizes.find((size: any) => size.size === order.size);
      if (sizeItem) {
        if (sizeItem.quantity > 0) {
          sizeItem.quantity -= 1;
        } else {
          throw new Error("Not enough stock for the specified size");
        }
      } else {
        throw new Error(`Size ${order.size} not found for product ${order.product}`);
      }
    }
    // Reduce the color stock if specified
    if (order.color) {
      const colorItem = product.colors.find((color: any) => color.color === order.color);
      if (colorItem) {
        if (colorItem.quantity > 0) {
          colorItem.quantity -= 1;
        } else {
          throw new Error("Not enough stock for the specified color");
        }
      } else {
        throw new Error(`Size ${order.size} not found for product ${order.product}`);
      }
    }
    await product.save();
    console.log("succsee");

  };
};

