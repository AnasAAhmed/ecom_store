import BestSellingProductsList from "@/components/BestSellingPro";
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <Image src="/banner2.png" alt="banner" width={2000} height={1000} className="w-screen" />
      <Collections />
      <ProductList />
      <BestSellingProductsList />
    </>
  );
}

export const dynamic = "force-dynamic";

