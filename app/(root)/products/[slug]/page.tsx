import Gallery from "@/components/Gallery";
import PaginationControls from "@/components/PaginationControls";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import ProductReviews from "@/components/ProductReviews";
import { getProductDetails, getProductDetailsForSeo, getProductReviews } from "@/lib/actions/actions";
import { unSlugify } from "@/lib/utils/features";
import { notFound } from "next/navigation";

type ReviewData = {
  reviews: ReviewType[];
  totalReviews: number;
}

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  const product: ProductType = await getProductDetailsForSeo(params.slug);

  return {
    title: unSlugify(product.title) + ' | Borcelle',
    description: product.description || "Shop high-quality products at Borcelle.",
    robots: {
      index: product.tags,
      follow: product.tags,
      googleBot: {
        index: product.tags,
        follow: product.tags
      }
    },
    openGraph: {
      title: product.title + ' | Borcelle',
      description: product.description || "Shop high-quality products at Borcelle.",
      url: `${process.env.ECOM_STORE_UR}/products/${params.slug}`,
      canonical: `${process.env.ECOM_STORE_UR}/products/${params.slug}`,
      type: 'website',
      images: [
        {
          url: product.media[0] || 'fallback-image.jpg',
          width: 220,
          height: 250,
          alt: product.title,
        },
      ],
      site_name: 'Borcelle Next.js',
    },

  };
};

type ProductDetailsType = {
  product: ProductType,
  relatedProducts: ProductType[]
}

const ProductDetails = async ({
  params, searchParams
}: { params: { slug: string }, searchParams: { page: string } }) => {

  const page = Number(searchParams.page) || 1;

  const data: ProductDetailsType = await getProductDetails(params.slug);

  if (!data.product) return notFound();

  const reviewData: ReviewType[] = await getProductReviews(data.product._id, page,);

  // const relatedProducts = await getRelatedProducts(
  //   product._id,
  //   product.category,
  //   product.collections
  // );


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: data.product.title,
            description: data.product.description,
            image: data.product.media[0],
            offers: {
              "@type": "AggregateOffer",
              availability: data.product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              priceCurrency: "USD",
              price: data.product.price,
              highPrice: data.product.price,
              lowPrice: data.product.price
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: data.product.ratings,
              reviewCount: data.product.numOfReviews
            }
          }),
        }}
      />
      {/* Main Content */}
      <section className="flex justify-center mt-8 md:mt-0 items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
        <Gallery productMedia={data.product.media} />
        <ProductInfo productInfo={data.product} />
      </section>
      <section className="my-5">
        <ProductReviews
          productReviews={reviewData}
          productId={data.product._id}
          numOfReviews={data.product.numOfReviews}
        />
        <PaginationControls isScrollToTop={false} totalPages={data.product.numOfReviews / 4} currentPage={page} />

      </section>

      <section className="flex flex-col items-center px-10 py-5 max-md:px-3">
        <p className="text-heading3-bold">Related Products</p>
        <div className="flex flex-wrap justify-center mt-8 gap-16">
          {data.relatedProducts?.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export const dynamic = "force-dynamic";

export default ProductDetails;
