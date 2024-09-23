import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import ProductReviews from "@/components/ProductReviews";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";
import { unSlugify } from "@/lib/utils/features";
import Head from "next/head";
import { notFound } from "next/navigation";

type ProductData = {
  productDetails: ProductType;
  reviews: ReviewType[]
}

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  return {
    title: `${unSlugify(params.slug)} | Borcelle`,
    description: 'This is a product from Borcelle Store named: ' + params.slug,
  };
};

const ProductDetails = async ({ params }: { params: { slug: string } }) => {
  const data: ProductData = await getProductDetails(params.slug, 1);
  if (!data) return notFound();
  const relatedProducts = await getRelatedProducts(
    data.productDetails._id,
    data.productDetails.category,
    data.productDetails.collections
  );


  return (
    <>
      {/* SEO Structured Data (JSON-LD for Schema.org) */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: data.productDetails.title,
              description: data.productDetails.description,
              image: data.productDetails.media[0],
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: data.productDetails.price,
              },
            }),
          }}
        />
      </Head>

      {/* Main Content */}
      <section className="flex justify-center mt-8 md:mt-0 items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
        <Gallery productMedia={data.productDetails.media} />
        <ProductInfo productInfo={data.productDetails} />
      </section>
      <section className="my-5">
        <ProductReviews
          productReviews={data.reviews}
          productId={data.productDetails._id}
          numOfReviews={data.productDetails.numOfReviews}
        />
      </section>

      <section className="flex flex-col items-center px-10 py-5 max-md:px-3">
        <p className="text-heading3-bold">Related Products</p>
        <div className="flex flex-wrap justify-center mt-8 gap-16">
          {relatedProducts?.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

// Dynamic content handling
export const dynamic = "force-dynamic";

export default ProductDetails;
