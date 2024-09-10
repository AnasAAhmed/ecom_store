import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import ProductReviews from "@/components/ProductReviews";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";
import { unSlugify } from "@/lib/utils/features";
import Head from "next/head";

export const generateMetadata = async ({ params ,searchParams}: { params: { slug: string } ,searchParams:{id:string}}) => {
  return {
    title: `${unSlugify( params.slug)} | Borcelle`,
    productId: searchParams.id, 
  };
};

const ProductDetails = async ({ params ,searchParams}: { params: { slug: string } ,searchParams:{id:string}}) => {
  const productDetails = await getProductDetails(searchParams.id);
  const relatedProducts = await getRelatedProducts(searchParams.id);

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
              name: productDetails.title,
              description: productDetails.description,
              image: productDetails.media[0], // Primary image URL
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: productDetails.price,
              },
            }),
          }}
        />
      </Head>

      {/* Main Content */}
      <article className="flex justify-center mt-8 md:mt-0 items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
        <Gallery productMedia={productDetails.media} />
        <ProductInfo productInfo={productDetails} />
      </article>
      <section className="my-5">
        <ProductReviews
          productReviews={productDetails.reviews}
          productId={productDetails._id}
          numOfReviews={productDetails.numOfReviews}
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
