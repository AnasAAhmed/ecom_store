"use client";

import { useEffect, useState } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import useCart, { useRegion } from "@/lib/hooks/useCart";
import StarRatings from "./StarRatings";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
    const [quantity, setQuantity] = useState(1);
    const cart = useCart();
    const { currency, exchangeRate } = useRegion();
    const price = (productInfo.price * exchangeRate).toFixed();
    const expense = (productInfo.expense * exchangeRate).toFixed();

    const uniqueSizes = Array.from(new Set(productInfo.variants.map(variant => variant.size)));
    const uniqueColors = Array.from(new Set(productInfo.variants.map(variant => variant.color)));
    const isColors = productInfo.variants.filter(i => i.color !== '')
    const isSizes = productInfo.variants.filter(i => i.size !== '')

    useEffect(() => {
        const availableVariant = productInfo.variants.find(variant => variant.quantity > 0);
        if (availableVariant) setSelectedVariant(availableVariant);
    }, [productInfo]);

    const handleSizeChange = (size: string) => {
        const matchingVariants = productInfo.variants.filter(variant => variant.size === size);
        setSelectedVariant(matchingVariants.length ? matchingVariants[0] : null);
    };

    const handleColorChange = (color: string) => {
        if (selectedVariant) {
            const variant = productInfo.variants.find(v => v.size === selectedVariant.size && v.color === color);
            setSelectedVariant(variant || null);
        }
    };

    return (
        <div className="max-w-[400px] sm:w-[500px] flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-heading3-bold">{productInfo.title}</p>
            </div>

            {/* Price & Discounts */}
            <div className="text-heading4-bold">
                <span className="text-small-medium mr-1">{currency}</span>{price}
                {productInfo.expense > 0 && (
                    <>
                        <span className="bg-red-600 ml-3 text-white text-[17px] px-2 py-1 rounded-md">
                            {((productInfo.expense - productInfo.price) / productInfo.expense * 100).toFixed(0)}% Off
                        </span>
                        <p className="text-small-medium line-through mt-3 text-red-1">{currency} {expense}</p>
                    </>
                )}
            </div>

            {/* Rating and Sold Count */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <StarRatings rating={productInfo.ratings} />
                    <span className="text-blue-500"> ({(productInfo.ratings).toFixed()}/5)</span>
                </div>
                sold({productInfo.sold})
            </div>

            {productInfo.variants.length > 0 ? (
                <>
                    {isSizes.length > 1 && uniqueSizes.length > 0 && (
                        <div className="flex mb-4">
                            {uniqueSizes.map((size, index) => (
                                <button
                                    key={index}
                                    className={`border border-black text-gray-800 px-2 py-1 mr-2 rounded-md ${selectedVariant?.size === size ? "bg-black text-white" : "bg-white"}`}
                                    onClick={() => handleSizeChange(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}

                    {isColors.length > 1 && uniqueColors.length > 0 && selectedVariant && (
                        <div className="flex mb-4">
                            {uniqueColors.map((color, index) => {
                                const isAvailable = productInfo.variants.some(
                                    (variant) => variant.size === selectedVariant.size && variant.color === color && variant.quantity > 0
                                );

                                return (
                                    <button
                                        key={index}
                                        className={`border border-black text-gray-800 px-2 py-1 mr-2 rounded-md ${selectedVariant.color === color ? "bg-black text-white" : "bg-white"} ${!isAvailable ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                                        disabled={!isAvailable}
                                        onClick={() => handleColorChange(color)}
                                    >
                                        {color}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {selectedVariant && (
                        <div className="text-body-medium text-grey-2">
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
                </>
            ) : (
                <div className="text-body-medium text-grey-2">
                    This product has no variants available. <br />
                    {productInfo.stock > 0 ? (
                        productInfo.stock < 6 ? (
                            <span className="text-red-500">Only {productInfo.stock} items left</span>
                        ) : (
                            <span className="text-green-500">Available</span>
                        )
                    ) : (
                        <span className="text-red-500">Not Available</span>
                    )}
                </div>
            )}

            {/* Quantity Selector */}
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
                className="outline text-base-bold py-3 disabled:cursor-not-allowed rounded-lg bg-black text-white hover:opacity-85"
                disabled={
                    (productInfo.variants.length > 0 && (!selectedVariant || selectedVariant.quantity < 1)) ||
                    productInfo.stock < 1
                }
                onClick={() => {
                    cart.addItem({
                        item: {
                            _id: productInfo._id,
                            title: productInfo.title,
                            description: productInfo.description,
                            media: productInfo.media,
                            expense: productInfo.expense,
                            stock: selectedVariant?.quantity || productInfo.stock,
                            price: productInfo.price,
                        },
                        quantity,
                        color: selectedVariant?.color,
                        size: selectedVariant?.size,
                        variantId: selectedVariant?._id,
                    });
                }}
            >
                {productInfo.variants.length > 0
                    ? (!selectedVariant || selectedVariant?.quantity < 1 ? "Not Available" : "Add to Cart")
                    : (productInfo.stock < 1 ? "Not Available" : "Add to Cart")}
            </button>

        </div>
    );
};

export default ProductInfo;
