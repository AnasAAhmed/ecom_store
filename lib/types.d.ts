type CollectionType = {
  _id: string;
  title: string;
  products: number;
  image: string;
};

 type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [string];
  tags: [string];
  price: number;
  expense: number;
  reviews?:[];
  numOfReviews:number;
  ratings:number;
  stock: number;
  sold?: number;
  sizes: [{
    size: string,
    quantity: number
  }],
  colors: [{
    color: string,
    quantity: number
  }],
  createdAt: string;
  updatedAt: string;
};

type UserType = {
  clerkId: string;
  wishlist: [string];
  createdAt: string;
  updatedAt: string;
};

type OrderType = {
  shippingAddress: Object;
  _id: string;
  customerClerkId: string;
  products: [OrderItemType]
  shippingRate: string;
  status: string;
  totalAmount: number
}

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  _id: string;
}
interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string; // ? means optional
  size?: string; // ? means optional
}
