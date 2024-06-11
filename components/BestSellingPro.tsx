import { getBestSellingProducts } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";

const BestSellingProductsList = async () => {

  const products = await getBestSellingProducts();
  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading2-bold">Top Selling Products</p>
      {!products || products.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-16">
          {products.map((product: ProductType) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellingProductsList;
