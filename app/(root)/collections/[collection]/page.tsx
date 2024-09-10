import ProductCard from "@/components/ProductCard";
import { getCollectionDetails } from "@/lib/actions/actions";
import { unSlugify } from "@/lib/utils/features";
import Head from "next/head";
import Image from "next/image";
import React from "react";

export const generateMetadata = async ({ params, searchParams }: { params: { collection: string }, searchParams: { id: string } }) => {
  return {
    title: `${unSlugify(params.collection)} | Borcelle`,
    productId: searchParams.id,
  };
};

const CollectionDetails = async ({
  searchParams
}: {
  searchParams: { id: string }
}) => {
  const collectionDetails = await getCollectionDetails(searchParams.id);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "CollectionPage", // Change to CollectionPage for a collection
              name: collectionDetails.title, // Collection title
              description: collectionDetails.description, // Collection description
              mainEntity: collectionDetails.products.map((product: ProductType) => ({
                "@type": "Product",
                name: product.title, // Product name
                description: product.description, // Product description
                image: product.media[0],
                offers: {
                  "@type": "Offer",
                  priceCurrency: "USD",
                  price: product.price,
                },
              })),
            }),
          }}
        />
      </Head>
      <div className="px-10 py-5 flex flex-col items-center gap-8">
        <Image
          src={collectionDetails.image}
          width={1500}
          height={1000}
          alt="collection"
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <p className="text-heading3-bold text-grey-2">{collectionDetails.title}</p>
        <p className="text-body-normal text-grey-2 text-center max-w-[900px]">{collectionDetails.description}</p>
        <div className="flex flex-wrap gap-16 justify-center  min-h-[90vh]">
          {collectionDetails.products.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CollectionDetails;

export const dynamic = "force-dynamic";

