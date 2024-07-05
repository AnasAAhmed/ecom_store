"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";
import { FaStar } from "react-icons/fa";
import { useRegion } from "@/lib/hooks/useCart";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const { currency } = useRegion();
  return (
    <div

      className="w-[220px] flex flex-col gap-2"
    >
      <Link href={`/products/${product._id}`}>
        <Image
          src={product.media[0]}
          alt="product"
          width={250}
          height={300}
          className="h-[250px] rounded-lg object-cover"
        />
        <div className="flex mt-3 flex-row justify-between items-center">
          <p className="text-base-bold ">{product.title}</p>
        </div>
        <div className="flex flex-row mt-2 justify-between items-center">
          <div className="flex flex-row gap-1 items-center">
            <FaStar className="text-blue-500 " />
            <span className="text-small-medium text-blue-500">({product.ratings}/5)</span>
            <span className="text-small-medium text-grey-2">({product.numOfReviews})</span>
          </div>
          {product.sold! > 0 && <p className="text-small-medium text-grey-2">sold({product.sold})</p>}
        </div>
      </Link>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="text-body-bold ">{currency === 'pkr' ? "Rs" : '$'} {currency === 'pkr' ? product.price * 250 : product.price}</p>
          <p className="text-small-medium line-through text-red-1">{currency === 'pkr' ? "Rs" : '$'} {currency === 'pkr' ? product.expense * 278 : product.expense}</p>
        </div>
        <HeartFavorite productId={product._id} updateSignedInUser={updateSignedInUser} />
      </div>
    </div>
  );
};

export default ProductCard;
