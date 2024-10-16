import dynamic from 'next/dynamic';
import Banner from "@/components/Banner";
import { getBestSellingProducts, getCollections, getProducts } from "@/lib/actions/actions";
import Collections from '@/components/Collections';
import ProductList from '@/components/ProductList';
import BestSellingProductsList from '@/components/BestSellingPro';
const BlogSection = dynamic(() => import('@/components/BlogSection'), { ssr: false });
const Social = dynamic(() => import('@/components/Social'), { ssr: false });
const GroupComponent7 = dynamic(() => import('@/components/Services'), { ssr: false });

export default async function Home() {
  const [collections, latestProducts, bestSellingProducts] = await Promise.all([
    getCollections() || 'Internal server Error',
    getProducts() || 'Internal server Error',
    getBestSellingProducts() || 'Internal server Error',
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

      {latestProducts && <ProductList latestProducts={latestProducts} />}
      <Banner
        heading="Summer Collection 2024"
        text="Embrace the warmth with our stylish and comfortable summer wear"
        imgUrl={'/banner2.png'}
        shade="gray"
        textColor="white"
        link="/search?query=summer"
        buttonText="Shop Now"
      />

      {bestSellingProducts && <BestSellingProductsList bestSellingProducts={bestSellingProducts} />}

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

export const revalidate = false; 

// import BestSellingProductsList from "@/components/BestSellingPro";
// import BlogSection from "@/components/BlogSection";
// import Collections from "@/components/Collections";
// import ProductList from "@/components/ProductList";
// const GroupComponent7 = dynamic(() => import('@/components/Services'), { ssr: false });
// const Social = dynamic(() => import('@/components/Social'), { ssr: false });
// import Banner from "@/components/Banner";
// import { getBestSellingProducts, getCollections, getProducts } from "@/lib/actions/actions";

// export default async function Home() {
//   const collections = await getCollections() || 'Internal server Error';
//   const latestProducts = await getProducts() || 'Internal server Error';
//   const bestSellingProducts = await getBestSellingProducts() || 'Internal server Error';

//   return (
//     <>
//       <Banner
//         heading="Elevate Your Style"
//         text=" Discover the latest trends in fashion with our new collection."
//         imgUrl={'/banner2.avif'}
//         shade=""
//         textColor="black"
//         link="/search"
//         buttonText="Shop"
//       />
//       <Collections collections={collections} />
//       {collections && <ProductList latestProducts={latestProducts} />}
//       <Banner
//         heading="Summer Collection 2024"
//         text="Embrace the warmth with our stylish and comfortable summer wear "
//         imgUrl={'/banner2.png'}
//         shade="gray"
//         textColor="white"
//         link="/search?query=summer"
//         buttonText="Shop Now"
//       />
//       {latestProducts && <BestSellingProductsList bestSellingProducts={bestSellingProducts} />}
//       <BlogSection />
//       <Social />
//       <GroupComponent7
//         freeDeliveryHeight="unset"
//         freeDeliveryDisplay="unset"
//         daysReturnHeight="unset"
//         daysReturnDisplay="unset"
//         securePaymentHeight="unset"
//         securePaymentDisplay="unset"
//       />
//     </>
//   );
// }

// export const dynamic = "force-dynamic";