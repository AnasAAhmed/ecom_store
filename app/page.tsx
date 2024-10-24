import Banner from "@/components/Banner";
import { getBestSellingProducts, getCollections, getProducts } from "@/lib/actions/actions";
import Collections from '@/components/Collections';
import ProductList from '@/components/ProductList';
import BlogSection from "@/components/BlogSection";
import Social from "@/components/Social";
import GroupComponent7 from "@/components/Services";

export const dynamic = 'force-static';


export default async function Home() {
  const [collections, latestProducts, bestSellingProducts] = await Promise.all([
    getCollections(),
    getProducts(),
    getBestSellingProducts(),
  ]);

  return (
    <>
      <Banner
        heading="Elevate Your Style"
        text=" Discover the latest trends in fashion with our new collection."
        imgUrl={'/banner2.avif'}
        shade=""
        textColor="black"
        link="/search"
        buttonText="Shop"
      />

      {collections && <Collections collections={collections} />}

      {latestProducts && <ProductList heading="Latest Products" Products={latestProducts} />}
      <Banner
        heading="Summer Collection 2024"
        text="Embrace the warmth with our stylish and comfortable summer wear"
        imgUrl={'/banner2.png'}
        shade="gray"
        textColor="white"
        link="/search?query=summer"
        buttonText="Shop Now"
      />

      {bestSellingProducts && <ProductList heading="Our Top Selling Products" Products={bestSellingProducts} />}

      <BlogSection />
      <Social />
      <GroupComponent7
        freeDeliveryHeight="unset"
        freeDeliveryDisplay="unset"
        daysReturnHeight="unset"
        daysReturnDisplay="unset"
        securePaymentHeight="unset"
        securePaymentDisplay="unset"
      />
    </>
  );
}
export const revalidate = 43200;
