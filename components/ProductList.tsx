import ProductCard from "./ProductCard";
import Link from "next/link";

const ProductList = async ({ latestProducts }: { latestProducts: ProductType[] | string }) => {

  if (typeof latestProducts === 'string') return latestProducts || 'Please checkout your Internet';

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading2-bold">Latest Products</p>
      {!latestProducts || latestProducts.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-16">
          {latestProducts.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      <div className="self-stretch flex flex-row items-start justify-center py-[0rem] px-[1.25rem]">
        <div className="w-[12.875rem] flex flex-col items-start justify-start ">
          <Link href="/search" className="h-[1.875rem] mx-auto relative font-medium inline-block z-[1] text-heading4-bold">
            View All Products
          </Link>
          <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0.187rem] pl-[0.375rem]">
            <div className="h-[0.125rem] flex-1 relative box-border z-[1] border-t-[2px] border-solid border-black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
