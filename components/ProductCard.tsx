"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ShoppingCart } from "lucide-react";
import HeartFavorite from "./HeartFavorite";
import StarRatings from "./StarRatings";
import useCart, { useRegion } from "@/lib/hooks/useCart";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const { currency, exchangeRate } = useRegion();
  const cart = useCart();
  const {
    _id,
    slug,
    title,
    price,
    expense,
    media,
    stock,
    ratings,
    numOfReviews,
    sold,
    variants,
  } = product;

  const productPrice = (price * exchangeRate).toFixed();
  const productExpense = (expense * exchangeRate).toFixed();
  const isSoldOut = stock < 1;

  const handleAddToCart = () => {
    cart.addItem({
      item: { _id, title, media, price, expense, stock },
      quantity: 1,
    });
  };

  return (
    <div
      className={`sm:w-[220px] w-[150px] group flex shadow-lg hover:shadow-xl flex-col gap-2 ${
        isSoldOut ? "opacity-70" : ""
      }`}
    >
      <Link href={`/products/${slug}`} onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <Image
            src={media[0]}
            alt={title}
            width={250}
            height={220}
            className="h-[140px] sm:h-[220px] object-cover"
          />
          {isSoldOut ? (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-md">
              Sold Out
            </span>
          ) : (
            expense > 0 && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-small-medium px-2 py-1 rounded-md">
                {((expense - price) / expense * 100).toFixed(0)}% Off
              </span>
            )
          )}

          {!isSoldOut && variants?.length > 0 ? (
            <span className="absolute bottom-2 left-2 bg-gray-400 text-white text-sm px-2 py-1 rounded-md">
              <ChevronDown />
            </span>
          ) : (
            <button
              aria-label="Add to cart"
              disabled={isSoldOut}
              onClick={handleAddToCart}
              className="disabled:cursor-not-allowed absolute bottom-2 left-2 bg-gray-400 text-white text-sm px-2 py-1 rounded-md"
            >
              <ShoppingCart />
            </button>
          )}
        </div>
        <div className="mt-3 mx-2">
          <p className="text-small-medium line-clamp-2 max-w-52">{title}</p>
        </div>
        <div className="flex justify-between items-center mx-2">
          <div className="flex gap-2 items-center">
            <p className="text-body-bold">
              <span className="text-[12px]">{currency}</span>{productPrice}
            </p>
            {expense > price && (
              <p className="text-small-medium line-through text-red-600">
                {productExpense}
              </p>
            )}
          </div>
          <HeartFavorite productId={_id} updateSignedInUser={updateSignedInUser} />
        </div>
        <div className="flex justify-between items-center my-1 mx-2">
          <div className="flex items-end">
            <StarRatings rating={ratings} />
            <span className="text-[14px] text-grey-2">({numOfReviews})</span>
          </div>
          {sold > 0 && (
            <p className="text-[9px] sm:text-small-medium self-end text-grey-2">
              Sold({sold})
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
