import { getBestSellingProducts } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";

const BestSellingProductsList = async ({ bestSellingProducts }: { bestSellingProducts: ProductType[] | string }) => {

  if (typeof bestSellingProducts === 'string') return bestSellingProducts || 'Please checkout your Internet';

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading2-bold">Top Selling Products</p>
      {!bestSellingProducts || bestSellingProducts.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-16">
          {bestSellingProducts.map((product: ProductType) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellingProductsList;
