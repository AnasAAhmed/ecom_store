"use client";

import { useEffect, useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";

import useCart from "@/lib/hooks/useCart";
import StarRatings from "./StarRatings";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [colorQuantity, setColorQuantity] = useState<number>(0);
    const [sizeQuantity, setSizeQuantity] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        const availableColor = productInfo.colors.find(color => color.quantity > 0);
        if (availableColor) {
            setSelectedColor(availableColor.color);
            setColorQuantity(availableColor.quantity);
        }

        // Find the first size with quantity > 0
        const availableSize = productInfo.sizes.find(size => size.quantity > 0);
        if (availableSize) {
            setSelectedSize(availableSize.size);
            setSizeQuantity(availableSize.quantity);
        }
    }, [])

    const cart = useCart();

    return (
        <div className="max-w-[400px] flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-heading3-bold">{productInfo.title}</p>
                <HeartFavorite productId={productInfo._id} />
            </div>

            <div className="flex gap-2">
                <p className="text-base-medium text-grey-2">Category:</p>
                <p className="text-base-bold">{productInfo.category}</p>
            </div>

            <p className="text-heading3-bold">$ {productInfo.price}</p>
            <div className="flex items-center justify-between">
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

            {productInfo.colors.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-base-medium text-grey-2">Colors:</p>
                    <div className="flex gap-2">
                        {productInfo.colors.map((item, index) => (
                            <p
                                key={index}
                                className={`border border-${item.color}-500 ${item.quantity <= 0 && "line-through"} px-2 py-1 rounded-lg cursor-pointer ${selectedColor === item.color && "bg-black text-white"
                                    }`}
                                onClick={() => { setSelectedColor(item.color); setColorQuantity(item.quantity) }}
                            >
                                {item.color}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {productInfo.sizes.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-base-medium text-grey-2">Sizes:</p>
                    <div className="flex gap-2">
                        {productInfo.sizes.map((item, index) => (
                            <p
                                key={index}
                                className={`border ${item.quantity <= 0 && "line-through"} border-black px-2 py-1 rounded-lg cursor-pointer ${selectedSize === item.size && "bg-black text-white"
                                    }`}
                                onClick={() => {
                                    setSelectedSize(item.size); setSizeQuantity(item.quantity)
                                }}
                            >
                                {item.size}
                            </p>
                        ))}
                    </div>
                </div>
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
                disabled={productInfo.stock < 1 || productInfo.sizes.length > 0 && sizeQuantity < 1 || productInfo.colors.length > 0 && colorQuantity < 1}
                onClick={() => {
                    cart.addItem({
                        item: productInfo,
                        quantity,
                        stock: productInfo.stock,
                        color: selectedColor,
                        size: selectedSize,
                    });
                }}
            >
                {productInfo.stock < 1 || productInfo.sizes.length > 0 && sizeQuantity < 1 || productInfo.colors.length > 0 && colorQuantity < 1 ? "Not Avialable" : "Add To Cart"}
            </button>
        </div>
    );
};

export default ProductInfo;
