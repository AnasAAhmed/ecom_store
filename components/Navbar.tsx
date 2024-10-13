"use client";

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import Currency from "./Currency";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    const page = params.get("page");
    if (page) params.delete("page");
    router.push(`/search?query=${query}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query) handleSearch();
  };

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="hidden sm:flex justify-between items-center w-full bg-black text-white h-10 py-2 px-4">
        <h1 className="font-mono text-heading2-bold">50% Off</h1>
        <div className="flex gap-4 text-base-bold">
          {["watch", "hat", "shoes", "kids", "women", "men"].map((item) => (
            <Link
              key={item}
              href={`/collections/${item}`}
              className="hover:border-white border-b-2 border-black"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
        <h1>Help: +(84) 546-6789</h1>
      </nav>

      <nav className="sticky max-sm:fixed top-0 z-30 w-full bg-white shadow-md">
        <div className="flex justify-between items-center p-2">
          <Link href="/">
            <Image src="/logo.png" priority alt="logo" width={130} height={100} />
          </Link>

          {/* Desktop search bar */}
          <div className="hidden sm:flex items-center gap-3 border rounded-lg px-3 py-1">
            <input
              className="outline-none w-full"
              placeholder="Search..."
              value={query}
              onKeyDown={onKeyDown}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search onClick={handleSearch} className="cursor-pointer h-4 w-4 hover:text-blue-500" />
          </div>

          <div className="hidden lg:flex gap-4">
            {["/", "/search", "/contact", "/wishlist", "/orders"].map(
              (path, idx) => (
                <Link
                  key={idx}
                  href={path}
                  className={`hover:text-blue-500 ${pathname === path && "text-blue-500"}`}
                >
                  {["Home", "Shop", "Contact", "Wishlist", "Orders"][idx]}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <Currency className="hidden sm:inline" />
            <Link href="/cart" className="hidden md:flex items-center gap-2 border px-2 py-1 rounded-lg hover:bg-black hover:text-white">
              <ShoppingCart />
              <span>Cart ({cart.cartItems.length})</span>
            </Link>
            <Menu onClick={toggleModal} className="lg:hidden cursor-pointer" />
            {user ? <UserButton afterSignOutUrl="/sign-in" /> : <Link href="/sign-in"><CircleUserRound /></Link>}
          </div>

          {/* Mobile search bar */}
        </div>
        <div className="px-4 flex sm:hidden pb-2">
          <div className="flex sm:hidden w-full items-center border rounded-lg px-4 py-1">
            <input
              className="outline-none w-full"
              placeholder="Search..."
              value={query}
              onKeyDown={onKeyDown}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search onClick={handleSearch} className="cursor-pointer h-4 w-4 hover:text-blue-500" />
          </div>
        </div>
        {/* Mobile Modal */}
        <Modal isOpen={isOpen} onClose={toggleModal} overLay={true}>
          <ul className="flex flex-col p-3 gap-3 bg-white rounded-lg border">

            {["/", "/search", "/contact", "/wishlist", "/orders"].map((name, idx) => (
              <Link
                key={idx}
                href={name}
                onClick={toggleModal}>
                                {["Home", "Shop", "Contact", "Wishlist", "Orders"][idx]}

              </Link>
            ))}
            <Link href="/cart" className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white" onClick={toggleModal}>
              <ShoppingCart />
              <span>Cart ({cart.cartItems.length})</span>
            </Link>
            <Currency className="sm:hidden" />
          </ul>
        </Modal>
      </nav>
    </>
  );
};

export default Navbar;
