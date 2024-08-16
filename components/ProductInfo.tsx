"use client";

import { useEffect, useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";

import useCart, { useRegion } from "@/lib/hooks/useCart";
import StarRatings from "./StarRatings";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [availableColors, setAvailableColors] = useState<string[]>([]);
    const [variantstock, setVariantStock] = useState<number>(0);
    const [selectedVariantId, setSelectedVariantId] = useState<string>("");

    useEffect(() => {
        if (productInfo.variants && productInfo.variants.length > 0) {
            const availableVariant = productInfo.variants.find(variant => variant.quantity > 0);
            if (availableVariant) {
                setSelectedSize(availableVariant.size);
                handleSizeChange(availableVariant.size);
            }
        } else {
            setSelectedSize("");
            setSelectedColor("");
            setAvailableColors([]);
            setVariantStock(0);
            setSelectedVariantId("");
        }
    }, []);

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);

        const colors = productInfo.variants
            ?.filter(variant => variant.size === size && variant.quantity > 0)
            .map(variant => variant.color) || [];
        setAvailableColors(colors);

        if (colors.length > 0) {
            setSelectedColor(colors[0]);
            handleVariantChange(size, colors[0]);
        } else {
            setSelectedColor("");
            setVariantStock(0);
            setSelectedVariantId("");
        }
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        handleVariantChange(selectedSize, color);
    };

    const handleVariantChange = (size: string, color: string) => {
        const variant = productInfo.variants?.find(v => v.size === size && v.color === color);

        if (variant) {
            setVariantStock(variant.quantity);
            setSelectedVariantId(variant._id);
        } else {
            setVariantStock(0);
            setSelectedVariantId("");
        }
    };


    const cart = useCart();
    const { currency, exchangeRate } = useRegion();
    const price = productInfo.price * exchangeRate;
    const expense = productInfo.expense * exchangeRate;
    const uniqueSizes = Array.from(new Set(productInfo.variants?.map(variant => variant.size) || []));



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

            <p className="text-heading4-bold">
                <span className="text-small-medium mr-1">
                    {currency}
                </span> 
                {price.toFixed()}
                <span className="bg-red-600 ml-3 text-white text-[17px] px-2 py-1 rounded-md">
                    {((productInfo.expense - productInfo.price) / productInfo.expense * 100).toFixed(0)}% Off
                </span>
            </p>
            {productInfo.expense && <p className="text-small-medium line-through text-red-1">{currency} {expense.toFixed()}</p>
            } <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <StarRatings rating={productInfo.ratings} />
                    <span className="text-blue-500"> ({productInfo.ratings}/5)</span>
                </div>
                sold({productInfo.sold})
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-base-medium text-grey-2">Description:</p>
                <p className="text-small-medium">{productInfo.description}</p>
            </div>

            {productInfo.variants?.length > 0 && (
                <div>
                    Combination Stock:{" "}
                    {variantstock > 0 ? (
                        variantstock < 6 ? (
                            <span className="text-red-500">Only {variantstock} items left</span>
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
            <br />
            {productInfo.variants?.length > 0 && (
                <>
                    <div className="flex mb-4">
                        {uniqueSizes.length > 0 && uniqueSizes.map((size, index) => (
                            <button
                                key={index}
                                className={`${selectedSize === size ? "bg-black text-white" : "bg-white text-gray-800"} border border-black text-gray-800 px-2 py-1 mr-2 rounded-md`}
                                onClick={() => handleSizeChange(size)}
                            >{size}</button>
                        ))}
                    </div>
                    <div className="flex mb-4">
                        {availableColors.length > 0 && availableColors.map((color, index) => (
                            <button
                                key={index}
                                className={`${selectedColor === color ? "bg-black text-white" : "bg-white text-gray-800"} border border-black text-gray-800 px-2 py-1 mr-2 rounded-md`}
                                onClick={() => handleColorChange(color)}
                            >{color}</button>
                        ))}
                    </div>
                </>
            )}
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
                        onClick={() => setQuantity(quantity + 1)}
                    />
                </div>
            </div>

            <button
                className='outline text-base-bold py-3 rounded-lg hover:bg-black hover:text-white'
                disabled={(variantstock < 1 && productInfo.variants?.length > 0) || productInfo.stock < 1}
                onClick={() => {
                    cart.addItem({
                        item: productInfo,
                        quantity,
                        stock: productInfo.stock,
                        color: selectedColor,
                        size: selectedSize,
                        variantId: selectedVariantId
                    });
                }}
            >
                {(variantstock < 1 && productInfo.variants?.length > 0) || productInfo.stock < 1 ? "Not Available" : "Add to Cart"}

            </button>
        </div>
    );
};

export default ProductInfo;
