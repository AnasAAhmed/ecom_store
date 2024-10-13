import BestSellingProductsList from "@/components/BestSellingPro";
import BlogSection from "@/components/BlogSection";
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";
import GroupComponent7 from "@/components/Services";
import Banner from "@/components/Banner";
import Social from "@/components/Social";
import { getHomePageProducts } from "@/lib/actions/actions";

export default async function Home() {

  const data = await getHomePageProducts();
  const collections = data.collections || 'Internal server Error';
  const bestSellingProducts = data.bestSellingProducts || 'Internal server Error';
  const latestProducts = data.latestProducts || 'Internal server Error';
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
      <Collections collections={collections}/>
      <ProductList latestProducts={latestProducts}/>
      <Banner
        heading="Summer Collection 2024"
        text="Embrace the warmth with our stylish and comfortable summer wear "
        imgUrl={'/banner2.png'}
        shade="gray"
        textColor="white"
        link="/search?query=summer"
        buttonText="Shop Now"
      />
      <BestSellingProductsList bestSellingProducts={bestSellingProducts}/>
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

export const dynamic = "force-dynamic";

