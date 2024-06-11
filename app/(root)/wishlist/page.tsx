"use client";

import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const Wishlist = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  const getUser = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setSignedInUser(data);
      setLoading(false);
    } catch (err) {
      console.log("[users_GET]", err);
      setLoading(false);  // Ensure loading state is reset on error
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    } else {
      setLoading(false); // Ensure loading state is reset when user is not authenticated
    }
  }, [user]);

  const getWishlistProducts = async () => {
    setLoading(true);

    if (!signedInUser) {
      setLoading(false);
      return;
    }

    try {
      const wishlistProducts = await Promise.all(
        signedInUser.wishlist.map(async (productId) => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
          return res.json();
        })
      );
      setWishlist(wishlistProducts);
    } catch (err) {
      console.log("[wishlist_GET]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts();
    }
  }, [signedInUser]);

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser);
    // Refresh the wishlist after updating the signed-in user
    setLoading(true); // Set loading to true while fetching updated wishlist
    getWishlistProducts();
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">Your Wishlist</p>
      {wishlist.length === 0 && <p>No items in your wishlist</p>}

      <div className="flex flex-wrap justify-center gap-16">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} updateSignedInUser={updateSignedInUser} />
        ))}
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Wishlist;
