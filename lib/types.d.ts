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
  collections: [CollectionType];
  tags: [string];
  variants: [{
    _id:string;
    size:string;
    color:string;
    quantity:number
  }];
  stock:number;
  numOfReviews:number;
  sold:number;
  ratings:number;
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
}

type OrderProductCOD = {

  product: string,//it is product._id
  color: string,
  size: string,
  variantId?: string,
  quantity: number

}

type OrderProducts = {
  // product: string,//it is productId
  item: { _id: string; },//it is productId
  color: string,
  size: string,
  variantId?: string,
  quantity: number
}
type Variant = {
  color: string,
  size: string,
  _id: string,
  quantity: number
}

type Review ={
  _id: string;
  userId: string;
  name: string;
  photo: string;
  rating: number;
  comment: string;
  date: number;
}


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
  currency: string;
  totalAmount: number
  createdAt: string;
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
