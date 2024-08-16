"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import HeartFavorite from "./HeartFavorite";
import { useRegion } from "@/lib/hooks/useCart";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const { currency, exchangeRate } = useRegion();
  const isSoldOut = product.stock <= 0;
  const productPrice = (product.price * exchangeRate).toFixed();
  const productExpense = (product.expense * exchangeRate).toFixed();

  return (
    <div className={`w-[220px] flex flex-col gap-2 ${isSoldOut ? "opacity-70" : ""}`}>
      <Link href={`/products/${product._id}`}>
        <div className="relative">
          <Image
            src={product.media[0]}
            alt={product.title}
            width={250}
            height={300}
            className="h-[250px] rounded-lg object-cover"
          />
          {isSoldOut && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-md">
              Sold Out
            </span>
          )}
           {product.expense &&!isSoldOut && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-small-medium px-2 py-1 rounded-md">
              {((product.expense - product.price) / product.expense * 100).toFixed(0)}% Off
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-base-bold">{product.title} </p>
        
        </div>
        <div className="flex flex-row justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <FaStar className="text-blue-500" />
            <span className="text-small-medium text-blue-500">({product.ratings}/5)</span>
            <span className="text-small-medium text-grey-2">({product.numOfReviews})</span>
          </div>
          {product.sold! > 0 && (
            <p className="text-small-medium text-grey-2">Sold: {product.sold}</p>
          )}
        </div>
      </Link>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2 items-center">
          <p className="text-body-bold">
            <span className="text-small-medium">{currency}</span> {productPrice}
          </p>
          {product.expense > product.price && (
            <p className="text-small-medium line-through text-red-600">{productExpense}</p>
          )}
        </div>
        <HeartFavorite productId={product._id} updateSignedInUser={updateSignedInUser} />
      </div>
    </div>
  );
};

export default ProductCard;
