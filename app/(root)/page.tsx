import BestSellingProductsList from "@/components/BestSellingPro";
import BlogSection from "@/components/BlogSection";
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";
import GroupComponent7 from "@/components/Services";
import Social from "@/components/Social";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative w-full h-[300px]  sm:h-[400px] md:h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url("/banner2.avif")' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-60"></div>
        <div className="relative z-5 flex flex-col items-center justify-center h-full text-center text-white px-6 md:px-12 lg:px-24">
          <h1 className="text-heading1-bold font-bold mb-6 leading-tight">
            Elevate Your Style
          </h1>
          <p className="text-heading3-bold mb-10 ">
            Discover the latest trends in fashion with our new collection. Premium quality at unbeatable prices.
          </p>
          <Link href="/search">
            <div className="bg-white text-black font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              Shop Now
            </div>
          </Link>
        </div>
      </div>
      <Collections />
      <ProductList />
      <Image src={"/banner2.png"} alt="banner" width={2000} height={1000} className="w-screen" />
      <BestSellingProductsList />
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

