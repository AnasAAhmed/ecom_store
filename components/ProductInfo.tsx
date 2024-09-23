"use client";

import { useEffect, useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
import useCart, { useRegion } from "@/lib/hooks/useCart";
import StarRatings from "./StarRatings";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const cart = useCart();
    const { currency, exchangeRate } = useRegion();
    const price = (productInfo.price * exchangeRate).toFixed();
    const expense = (productInfo.expense * exchangeRate).toFixed();
    const uniqueSizes = Array.from(new Set(productInfo.variants.map(variant => variant.size)));

    useEffect(() => {
        const availableVariant = productInfo.variants.find(variant => variant.quantity > 0);
        if (availableVariant) setSelectedVariant(availableVariant);
    }, [productInfo]);

    const handleSizeChange = (size: string) => {
        const availableVariants = productInfo.variants.filter(v => v.size === size && v.quantity > 0);
        if (availableVariants.length) setSelectedVariant(availableVariants[0]);
        else setSelectedVariant(null);
    };

    const handleColorChange = (color: string) => {
        if (selectedVariant) {
            const variant = productInfo.variants.find(v => v.size === selectedVariant.size && v.color === color);
            if (variant) setSelectedVariant(variant);
        }
    };
    const c = productInfo.variants.filter(i => i.color !== '');
    const s = productInfo.variants.filter(i => i.size !== '');
    return (
        <div className="max-w-[400px] sm:w-[500px] flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-heading3-bold">{productInfo.title}</p>
                <HeartFavorite productId={productInfo._id} />
            </div>

            <div className="flex gap-2">
                <p className="text-base-medium text-grey-2">Category:</p>
                <p className="text-base-bold">{productInfo.category}</p>
            </div>

            <div className="text-heading4-bold">
                <span className="text-small-medium mr-1">{currency}</span>
                {price}
                {productInfo.expense > 0 && (
                    <>
                        <span className="bg-red-600 ml-3 text-white text-[17px] px-2 py-1 rounded-md">
                            {((productInfo.expense - productInfo.price) / productInfo.expense * 100).toFixed(0)}% Off
                        </span>
                        <p className="text-small-medium line-through mt-3 text-red-1">{currency} {expense}</p>
                    </>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <StarRatings rating={productInfo.ratings} />
                    <span className="text-blue-500"> ({productInfo.ratings}/5)</span>
                </div>
                sold({productInfo.sold})
            </div>

            {/* Size Selection */}
            {s.length > 0 && uniqueSizes.length > 0 && (
                <div className="flex mb-4">
                    {uniqueSizes.map((size, index) => (
                        <button
                            key={index}
                            className={`${selectedVariant?.size === size ? "bg-black text-white" : "bg-white text-gray-800"} border border-black text-gray-800 px-2 py-1 mr-2 rounded-md`}
                            onClick={() => handleSizeChange(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            )}

            {/* Color Selection */}
            {c.length > 0 && selectedVariant && (
                <div className="flex mb-4">
                    {productInfo.variants
                        .filter(v => v.size === selectedVariant.size && v.quantity > 0)
                        .map((variant, index) => (
                            <button
                                key={index}
                                className={`${selectedVariant.color === variant.color ? "bg-black text-white" : "bg-white text-gray-800"} border border-black text-gray-800 px-2 py-1 mr-2 rounded-md`}
                                onClick={() => handleColorChange(variant.color)}
                            >
                                {variant.color}
                            </button>
                        ))}
                </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
                <div>
                    Variant Stock:{" "}
                    {selectedVariant.quantity > 0 ? (
                        selectedVariant.quantity < 6 ? (
                            <span className="text-red-500">Only {selectedVariant.quantity} items left</span>
                        ) : (
                            <span className="text-green-500">Available</span>
                        )
                    ) : (
                        <span className="text-red-500">Not Available</span>
                    )}
                </div>
            )}

            <div>
                Overall Stock:{" "}
                {productInfo.stock > 0 ? (
                    productInfo.stock <= 4 ? (
                        <span className="text-red-500">Only {productInfo.stock} items left</span>
                    ) : (
                        <span className="text-green-500">Available</span>
                    )
                ) : (
                    <span className="text-red-500">Not Available</span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-base-medium text-grey-2">Description:</p>
                <p className="text-small-medium">{productInfo.description}</p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-base-medium text-grey-2">Quantity:</p>
                <div className="flex gap-4 items-center">
                    <MinusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    />
                    <p className="text-body-bold">{quantity}</p>
                    <PlusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => quantity < productInfo.stock && setQuantity(quantity + 1)}
                    />
                </div>
            </div>

            <button
                className="outline text-base-bold py-3 rounded-lg hover:bg-black hover:text-white"
                disabled={
                    (productInfo.variants?.length > 0 && (!selectedVariant || selectedVariant.quantity < 1)) ||
                    productInfo.stock < 1
                }
                onClick={() => {
                    cart.addItem({
                        item: productInfo,
                        quantity,
                        stock: productInfo.stock,
                        color: selectedVariant?.color,
                        size: selectedVariant?.size ,
                        variantId: selectedVariant?._id 
                    });
                }}
            >
                {productInfo.variants?.length > 0
                    ? (!selectedVariant || selectedVariant.quantity < 1 ? "Not Available" : "Add to Cart")
                    : (productInfo.stock > 0 ? "Add to Cart" : "Not Available")}
            </button>

        </div>
    );
};

export default ProductInfo;
